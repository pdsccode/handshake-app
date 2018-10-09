import React from 'react';
import {FormattedMessage, injectIntl} from 'react-intl';
import {change, Field, formValueSelector} from 'redux-form';
import {connect} from 'react-redux';
import {
  API_URL,
  CRYPTO_CURRENCY,
  CRYPTO_CURRENCY_NAME,
  EXCHANGE_ACTION,
  EXCHANGE_ACTION_NAME,
  FIAT_CURRENCY,
  FIAT_CURRENCY_NAME,
} from '@/constants';
import '../styles.scss';
import {validateSpecificAmount} from '@/components/handshakes/exchange/validation';
import createForm from '@/components/core/form/createForm';
import { fieldDropdown, fieldInput, fieldTextArea } from '@/components/core/form/customField';
import { required } from '@/components/core/form/validation';
import {
  createCCOrder,
  getCcLimits,
  getCryptoPrice,
  getCryptoPriceForPackage,
  getUserCcLimit,
  initPaymentInstantBuy,
  buyCryptoCod,
} from '@/reducers/exchange/action';
import CryptoPrice from '@/models/CryptoPrice';
import {MasterWallet} from '@/services/Wallets/MasterWallet';
import {bindActionCreators} from 'redux';
import {showAlert} from '@/reducers/app/action';
import {roundNumberByLocale} from '@/services/offer-util';
import {BigNumber} from 'bignumber.js';
import './BuyCryptoCoin.scss';
import {getErrorMessageFromCode} from '@/components/handshakes/exchange/utils';

import iconBitcoin from '@/assets/images/icon/coin/btc.svg';
import iconEthereum from '@/assets/images/icon/coin/eth.svg';
import iconBitcoinCash from '@/assets/images/icon/coin/bch.svg';
import iconUsd from '@/assets/images/icon/coin/icons8-us_dollar.svg';
import iconLock from '@/assets/images/icon/icons8-lock_filled.svg';
import Deposit from '@/pages/Escrow/Deposit';
import Modal from '@/components/core/controls/Modal/Modal';
import Image from '@/components/core/presentation/Image';
import loadingSVG from '@/assets/images/icon/loading.gif';
import AtmCashTransferInfo from '@/components/handshakes/exchange/AtmCashTransferInfo';
import ConfirmButton from '@/components/handshakes/exchange/components/ConfirmButton';

const adyenEncrypt = require('adyen-cse-web');

const nameFormShowAddressWallet = 'showAddressWallet';
const ShowAddressWalletForm = createForm({ propsReduxForm: { form: nameFormShowAddressWallet } });

export const CRYPTO_ICONS = {
  [CRYPTO_CURRENCY.ETH]: iconEthereum,
  [CRYPTO_CURRENCY.BTC]: iconBitcoin,
  BCH: iconBitcoinCash,
};

const CRYPTO_CURRENCY_CREDIT_CARD = {
  ...CRYPTO_CURRENCY, BCH: 'BCH',
};

const listCurrency = Object.values(CRYPTO_CURRENCY_CREDIT_CARD).map((item) => {
  return { id: item, text: <span><img src={CRYPTO_ICONS[item]} width={24} /> {CRYPTO_CURRENCY_NAME[item]}</span> };
});

const listPackages = {
  [CRYPTO_CURRENCY.ETH]: [{ name: 'basic', amount: 0.1, fiatAmount: 0, show: false }, { name: 'pro', amount: 0.4, fiatAmount: 0, show: false }],
  [CRYPTO_CURRENCY.BTC]: [{ name: 'basic', amount: 0.005, fiatAmount: 0, show: false }, { name: 'pro', amount: 0.01, fiatAmount: 0, show: false }],
  BCH: [{ name: 'basic', amount: 0.1, fiatAmount: 0, show: false }, { name: 'pro', amount: 0.15, fiatAmount: 0, show: false }],
};

const listFiatCurrency = [
  {
    id: FIAT_CURRENCY.USD,
    text: <span><img src={iconUsd} width={24} /> {FIAT_CURRENCY_NAME[FIAT_CURRENCY.USD]}</span>,
  },
];

export const PAYMENT_METHODS = {
  BANK_TRANSFER: 'bank_transfer',
  COD: 'cod',
};

const nameFormSpecificAmount = 'specificAmount';
const FormSpecificAmount = createForm({
  propsReduxForm: {
    form: nameFormSpecificAmount,
    initialValues: {
      currency: {
        id: CRYPTO_CURRENCY.BTC,
        text: <span><img src={iconBitcoin} width={22} /> {CRYPTO_CURRENCY_NAME[CRYPTO_CURRENCY.BTC]}</span>,
      },
      fiatCurrency: {
        id: FIAT_CURRENCY.USD,
        text: <span><img src={iconUsd} width={24} /> {FIAT_CURRENCY_NAME[FIAT_CURRENCY.USD]}</span>,
      },
      payment_method: PAYMENT_METHODS.BANK_TRANSFER,
    },
  },
});
const selectorFormSpecificAmount = formValueSelector(nameFormSpecificAmount);

const nameFormCreditCard = 'creditCard';
const FormCreditCard = createForm({
  propsReduxForm: {
    form: nameFormCreditCard,
    initialValues: {},
  },
});
const selectorFormCreditCard = formValueSelector(nameFormCreditCard);

const DECIMAL_NUMBER = 2;

export const fieldCheckBoxList = ({ input, name, titles, items, disabled = false }) => {
  const { onChange, value } = input;
  return (
    <div className="rf-type-atm-container d-table w-100" onChange={({ target }) => onChange(target.value)}>
      {Object.entries(items).map(([key, item_value]) => {
        console.log('key, item_value ', key, item_value);
        const label = titles[item_value];
        console.log('titels', titles, label);
        return (
          <label key={key} className="radio-inline rf-type-atm-radio-container d-table-cell w-50">
            <input
              value={item_value}
              type="radio"
              name={name}
              checked={value === item_value}
              onChange={() => null}
              disabled={disabled}
            />
            <span className="checkmark" />
            <span>{label}</span>
          </label>
        );
      })}
    </div>
  );
};

class FeedCreditCard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasSelectedCoin: false,
      isNewCCOpen: true,
      amount: 0,
      currency: CRYPTO_CURRENCY.BTC,
      fiatAmount: 0,
      fiatCurrency: FIAT_CURRENCY.USD,
      cryptoPrice: this.props.cryptoPrice,
      wallets: [],
      walletSelected: false,
      allowBuy: true,
      hasSelectedPackage: false,
      modalContent: '',
      modalTitle: '',
      isLoading: false,
      issuerUrl: '',
      paReq: '',
      md: '',
      termUrl: '',
    };
  }

  showLoading = () => {
    this.setLoading(true);
  };

  hideLoading = () => {
    this.setLoading(false);
  };

  setLoading = (loadingState) => {
    this.setState({ isLoading: loadingState });
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (JSON.stringify(nextProps.cryptoPrice) !== JSON.stringify(prevState.cryptoPrice)) {
      return { cryptoPrice: nextProps.cryptoPrice };
    }

    return null;
  }

  async componentDidMount() {
    const { currencyForced, rfChange } = this.props;
    if (currencyForced) {
      const item = { id: currencyForced, text: <span><img src={CRYPTO_ICONS[currencyForced]} width={24} /> {CRYPTO_CURRENCY_NAME[currencyForced]}</span> };
      rfChange(nameFormSpecificAmount, 'currency', item);

      this.setState({ currency: currencyForced }, () => {
        // this.getCryptoPriceByAmount(1);
      });
    } else {
      // this.getCryptoPriceByAmount(1);
    }

    this.props.getCcLimits({ PATH_URL: API_URL.EXCHANGE.GET_CC_LIMITS });
    this.props.getUserCcLimit({ PATH_URL: API_URL.EXCHANGE.GET_USER_CC_LIMIT });

    // this.intervalCountdown = setInterval(() => {
    //   const { amount } = this.props;
    //   this.getCryptoPriceByAmount(amount);
    // }, 30000);
    this.getListWallets();
    this.calculatePriceForPackages();
  }

  componentWillUnmount() {
    // if (this.intervalCountdown) {
    //   clearInterval(this.intervalCountdown);
    // }
  }

  calculatePriceForPackages = () => {
    Object.entries(listPackages).forEach(([currency, items]) => {
      items.forEach((item) => {
        const { amount } = item;
        this.getCryptoPriceForPackageByAmount(amount, currency);
      });
    });
  }

  getCryptoPriceForPackageByAmount = (amount, currency) => {
    const data = { amount, currency };

    this.props.getCryptoPriceForPackage({
      PATH_URL: API_URL.EXCHANGE.GET_CRYPTO_PRICE,
      qs: data,
      successFn: this.handleGetCryptoPriceForPackageSuccess,
      errorFn: this.handleGetCryptoPricePackageFailed,
    });
  };

  handleGetCryptoPriceForPackageSuccess = (responseData) => {
    const cryptoPrice = CryptoPrice.cryptoPrice(responseData.data);
    console.log('handleGetCryptoPriceForPackageSuccess', cryptoPrice);

    Object.entries(listPackages).forEach(([currency, items]) => {
      for (const item of items) {
        const { amount } = item;
        console.log('cryptoPrice.currency  cryptoPrice.amount ', cryptoPrice.currency, cryptoPrice.amount);
        console.log('currency  amount ', currency, amount);
        if (cryptoPrice.currency === currency && +cryptoPrice.amount === amount) {
          console.log('hello');
          item.show = true;
          item.fiatAmount = cryptoPrice.fiatAmount;
          break;
        }
      }
    });
  };

  handleGetCryptoPricePackageFailed = (e) => {
    console.log('handleGetCryptoPriceFailed', e);
  };

  getCryptoPriceByAmount = (amount) => {
    const { currency } = this.state;

    const data = { amount, currency };

    this.props.getCryptoPrice({
      PATH_URL: API_URL.EXCHANGE.GET_CRYPTO_PRICE,
      qs: data,
      successFn: this.handleGetCryptoPriceSuccess,
      errorFn: this.handleGetCryptoPriceFailed,
    });
  };

  handleGetCryptoPriceSuccess = (responseData) => {
    // console.log('handleGetCryptoPriceSuccess', data);
    // const { userCcLimit } = this.props;
    const { hasSelectedPackage } = this.state;
    const { amount } = this.props;
    const { rfChange } = this.props;
    const cryptoPrice = CryptoPrice.cryptoPrice(responseData.data);

    console.log('handleGetCryptoPriceSuccess amount', amount);
    let fiatAmount = amount * cryptoPrice.fiatAmount / cryptoPrice.amount || 0;

    fiatAmount = roundNumberByLocale(fiatAmount, cryptoPrice.fiatCurrency, DECIMAL_NUMBER);
    console.log('onAmountChange', fiatAmount);
    rfChange(nameFormSpecificAmount, 'fiatAmount', fiatAmount);

    this.setState({ allowBuy: true });

    if (hasSelectedPackage) {
      this.setState({ hasSelectedCoin: true, hasSelectedPackage: false });
    }
  };

  handleGetCryptoPriceFailed = (e) => {
    console.log('handleGetCryptoPriceFailed', e);
    this.setState({ allowBuy: false, hasSelectedPackage: false });
    this.props.showAlert({
      message: <div className="text-center">{getErrorMessageFromCode(e)}</div>,
      timeOut: 3000,
      type: 'danger',
    });
  };

  handleSubmitSpecificAmount = (values) => {
    console.log('handleSubmitSpecificAmount', values);

    const { payment_method } = values;

    this.setState({
      hasSelectedCoin: true, amount: values.amount, fiatAmount: values.fiatAmount, currency: values.currency.id, fiatCurrency: values.fiatCurrency.id,
    }, () => {
      this.getCryptoPriceByAmount(values.amount);

      if (payment_method === PAYMENT_METHODS.COD) {
        this.depositCoinATM();
      } else if (payment_method === PAYMENT_METHODS.BANK_TRANSFER) {
        this.openNewTransaction({});
      }
    });
  }

  handleValidateSpecificAmount = (values) => {
    return validateSpecificAmount(values, this.state, this.props);
  };

  onCurrencyChange = (e, newValue) => {
    const { currency, amount } = this.state;

    if (currency !== newValue.id) {
      this.setState({ currency: newValue.id }, () => {
        this.getCryptoPriceByAmount(amount);
        this.getListWallets(newValue.id);
      });
    }
  }

  onAmountChange = (e, amount) => {
    console.log('onAmountChange', amount);
    const { rfChange, cryptoPrice } = this.props;

    this.setState({ amount }, () => {
      if (this.intervalCountdown) {
        clearTimeout(this.intervalCountdown);
      }

      this.intervalCountdown = setTimeout(() => {
        this.getCryptoPriceByAmount(amount);
      }, 1000);
    });
  }

  componentWillUnmount() {
    if (this.intervalCountdown) {
      clearTimeout(this.intervalCountdown);
    }
  }

  onFiatAmountChange = (e, fiatAmount) => {
    console.log('onFiatAmountChange', fiatAmount);
    const { rfChange, cryptoPrice } = this.props;

    let newAmount = fiatAmount * cryptoPrice.amount / cryptoPrice.fiatAmount;
    newAmount = (new BigNumber(newAmount).decimalPlaces(6)).toNumber();
    console.log('onFiatAmountChange', newAmount);
    rfChange(nameFormSpecificAmount, 'amount', newAmount);
  }

  // generatePackages = (cryptoPrice) => {
  //   const { currency } = this.state;
  //   const moneyPackages = [{ name: 'basic', fiatAmount: 99 }, { name: 'pro', fiatAmount: 199 }];
  //
  //   const packages = moneyPackages.map((item) => {
  //     const { name, fiatAmount } = item;
  //
  //     let newAmount = fiatAmount * cryptoPrice.amount / cryptoPrice.fiatAmount;
  //     newAmount = (new BigNumber(newAmount).decimalPlaces(6)).toNumber();
  //
  //     return {
  //       name,
  //       price: `$${fiatAmount}`,
  //       amountText: `${newAmount} ${currency}`,
  //       amount: newAmount.toString(),
  //       fiatAmount: fiatAmount.toString(),
  //       currency,
  //       fiatCurrency: FIAT_CURRENCY.USD,
  //     };
  //   });
  //
  //   this.setState({ packages });
  // }

  handleBuyPackage = (item) => {
    const { amount } = item;
    this.setState({
      hasSelectedPackage: true, amount,
    }, () => {
      this.getCryptoPriceByAmount(amount);
    });
  }

  onItemSelectedWallet = (item) => {
    const wallet = MasterWallet.convertObject(item);

    this.setState({ walletSelected: wallet });
  }

  getListWallets = async () => {
    const { currency } = this.state;
    let walletDefault = await MasterWallet.getWalletDefault(currency);
    const wallets = MasterWallet.getWallets(currency);

    // set name + text for list:
    const listWalletCoin = [];
    if (wallets.length > 0) {
      wallets.forEach((wal) => {
        if (!wal.isCollectibles) {
          wal.text = `${wal.getShortAddress()} (${wal.name}-${wal.getNetworkName()})`;
          if (process.env.isLive) {
            wal.text = `${wal.getShortAddress()} (${wal.className} ${wal.name})`;
          }
          wal.id = `${wal.address}-${wal.getNetworkName()}${wal.name}`;
          listWalletCoin.push(wal);
        }
      });
    }

    if (!walletDefault) {
      if (listWalletCoin.length > 0) {
        walletDefault = listWalletCoin[0];
      }
    }


    if (walletDefault) {
      walletDefault.text = `${walletDefault.getShortAddress()} (${walletDefault.name}-${walletDefault.getNetworkName()})`;
      if (process.env.isLive) {
        walletDefault.text = `${walletDefault.getShortAddress()} (${walletDefault.className} ${walletDefault.name})`;
      }
      walletDefault.id = `${walletDefault.address}-${walletDefault.getNetworkName()}${walletDefault.name}`;

      // get balance for first item + update to local store:
      walletDefault.getBalance().then(result => {
        walletDefault.balance = walletDefault.formatNumber(result);
        this.setState({ walletSelected: walletDefault });
        MasterWallet.UpdateBalanceItem(walletDefault);
      });
    }

    this.setState({ wallets: listWalletCoin, walletSelected: walletDefault }, () => {
      // this.checkValid();
    });
  }

  depositCoinATM = () => {
    const { messages } = this.props.intl;

    this.setState({
      modalTitle: messages.me.credit.deposit.title,
      modalContent:
        (
          <Deposit setLoading={this.setLoading} history={this.props.history} />
        ),
    }, () => {
      this.modalRef.open();
    });
  }

  closeModal = () => {
    this.setState({ modalContent: '' });
  }

  openNewTransaction = (transaction) => {
    const { messages } = this.props.intl;
    const receipt = {
      createdAt: transaction.createdAt,
      customerAmount: +transaction.fiatAmount,
      amount: (+transaction.fiatAmount - +transaction.storeFee) || 0,
      fiatCurrency: transaction.fiatCurrency,
      referenceCode: transaction.refCode,
      status: transaction.status,
      id: transaction.id,
    };

    this.setState({
      modalTitle: messages.atm_cash_transfer_info.title,
      modalContent:
        (
          <AtmCashTransferInfo receipt={receipt} onDone={this.onReceiptSaved} />
        ),
    }, () => {
      this.modalRef.open();
    });
  }

  onReceiptSaved = () => {
    this.modalRef.close();
  }

  onBuy = () => {
    this.buyCryptoCod({
      PATH_URL: API_URL.BUY_CRYPTO_COD,
      successFn: this.handleBuyCryptoCodSuccess,
      errorFn: this.handleBuyCryptoCodFailed,
    });
  }

  handleBuyCryptoCodSuccess = (res) => {
    console.log('handleBuyCryptoCodSuccess', res);
  }

  handleBuyCryptoCodFailed = (e) => {
    console.log('handleBuyCryptoCodFailed', e);
  }

  renderCoD = () => {
    const { messages } = this.props.intl;
    return (
      <div className="choose-coin-cod-form">
        <div className="input-group mt-4">
          <Field
            type="text"
            className="form-control input-field"
            name="address"
            placeholder={messages.create.cod_form.your_address}
            component={fieldInput}
            validate={[required]}
          />
        </div>
        <div className="input-group mt-2">
          <Field
            type="text"
            className="form-control input-field"
            placeholder={messages.create.cod_form.time_note}
            name="noteAndTime"
            component={fieldTextArea}
            validate={[required]}
          />
        </div>
        <div className="input-group mt-2">
          <ConfirmButton
            label={messages.create.cod_form.buy_btn}
            buttonClassName="buy-btn"
            containerClassName="buy-btn-container"
            onConfirm={this.onBuy}
          />
        </div>
      </div>
    );
  }

  render() {
    const { messages } = this.props.intl;
    const { hasSelectedCoin, wallets, walletSelected } = this.state;
    const { intl, isPopup } = this.props;
    const { amount, cryptoPrice, payment_method } = this.props;
    const { currency, allowBuy } = this.state;
    const { issuerUrl, paReq, md, termUrl } = this.state;
    const { modalContent, modalTitle } = this.state;

    const packages = listPackages[currency];
    const canChangePaymentMethods = false;

    return (<div>
      <div className={`discover-overlay ${this.state.isLoading ? 'show' : ''}`}>
        <Image src={loadingSVG} alt="loading" width="100" />
      </div>
      <div className="choose-coin">
        <div className="specific-amount">
          <FormSpecificAmount onSubmit={this.handleSubmitSpecificAmount} validate={this.handleValidateSpecificAmount}>
            {/* <div className="text-right" style={{ margin: '-10px' }}><button className="btn btn-lg bg-transparent text-white d-inline-block">&times;</button></div> */}
            <div className="label-1">{messages.buy_coin.label.header}</div>
            <div className="label-2">{messages.buy_coin.label.description}</div>
            <div className="input-group mt-4">
              <Field
                name="amount"
                className="form-control form-control-lg border-0 rounded-right form-control-cc"
                type="text"
                component={fieldInput}
                onChange={this.onAmountChange}
                validate={[required]}
                elementAppend={
                  <Field
                    name="currency"
                    classNameWrapper=""
                    // defaultText={<FormattedMessage id="ex.create.placeholder.stationCurrency" />}
                    classNameDropdownToggle="dropdown-button"
                    list={listCurrency}
                    component={fieldDropdown}
                    // disabled={!enableChooseFiatCurrency}
                    onChange={this.onCurrencyChange}
                  />
                }
              />
            </div>
            <div className="input-group mt-2">
              <Field
                name="fiatAmount"
                className="form-control form-control-lg border-0 rounded-right form-control-cc"
                type="text"
                component={fieldInput}
                // onChange={this.onFiatAmountChange}
                validate={[required]}
                elementAppend={
                  <Field
                    name="fiatCurrency"
                    classNameWrapper=""
                    // defaultText={<FormattedMessage id="ex.create.placeholder.stationCurrency" />}
                    classNameDropdownToggle="dropdown-button"
                    list={listFiatCurrency}
                    component={fieldDropdown}
                    caret={false}
                  />
                }
                disabled
              />
            </div>
            <div className="input-group item-info mt-2">
              <Field
                component={fieldCheckBoxList}
                titles={messages.buy_coin.label.payment_methods}
                name="payment_method"
                items={PAYMENT_METHODS}
                disabled={!canChangePaymentMethods}
              />
            </div>
            <div className="mt-3 mb-3">
              <button type="submit" className="btn btn-lg btn-primary btn-block btn-submit-specific" disabled={!allowBuy}>
                <img src={iconLock} width={20} className="align-top mr-2" /><span>{EXCHANGE_ACTION_NAME[EXCHANGE_ACTION.BUY]} {amount} {CRYPTO_CURRENCY_NAME[currency]}</span>
              </button>
            </div>
            {payment_method === 'cod' && this.renderCoD()}
          </FormSpecificAmount>
        </div>

        <div className="by-package">
          <div className="my-3 p-label-choose">{messages.buy_coin.label.common_packages}</div>
          <div className="mb-5">
            {
              packages && packages.map((item, index) => {
                const {
                  name, amount, fiatAmount, show,
                } = item;

                return show && (
                  <div key={name}>
                    <div className="d-table w-100">
                      <div className="d-table-cell align-middle" style={{ width: '80px' }}>
                        <div className={`package p-${name}`}><FormattedMessage id={`cc.label.${name}`} /></div>
                      </div>
                      <div className="d-table-cell align-middle pl-3">
                        <div className="p-price">
                          {fiatAmount} {FIAT_CURRENCY.USD}
                          {/* {
                            saving && (
                              <span className="p-saving"><FormattedMessage id="cc.label.saving" values={{ percentage: saving }} /></span>
                            )
                          } */}
                        </div>
                        <div className="p-amount">{amount} {currency}</div>
                      </div>
                      <div className="d-table-cell align-middle text-right">
                        <button className="btn btn-p-buy-now" onClick={() => this.handleBuyPackage(item)}><FormattedMessage id="cc.btn.buyNow" /></button>
                      </div>
                    </div>
                    { index < packages.length - 1 && <hr /> }
                  </div>
                );
              })
            }
          </div>
        </div>
      </div>
      <Modal title={modalTitle} onRef={modal => this.modalRef = modal} onClose={this.closeModal}>
        {modalContent}
      </Modal>
    </div>
    );
  }
}

const mapStateToProps = (state) => ({
  userProfile: state.exchange.userProfile,
  cryptoPrice: state.exchange.cryptoPrice,
  userCcLimit: state.exchange.userCcLimit,
  ccLimits: state.exchange.ccLimits || [],
  authProfile: state.auth.profile,
  amount: selectorFormSpecificAmount(state, 'amount'),
  cc_email: selectorFormCreditCard(state, 'cc_email'),
  payment_method: selectorFormSpecificAmount(state, 'payment_method'),
});

const mapDispatchToProps = (dispatch) => ({
  getCryptoPrice: bindActionCreators(getCryptoPrice, dispatch),
  getCryptoPriceForPackage: bindActionCreators(getCryptoPriceForPackage, dispatch),
  createCCOrder: bindActionCreators(createCCOrder, dispatch),
  getUserCcLimit: bindActionCreators(getUserCcLimit, dispatch),
  getCcLimits: bindActionCreators(getCcLimits, dispatch),
  rfChange: bindActionCreators(change, dispatch),
  showAlert: bindActionCreators(showAlert, dispatch),
  initPaymentInstantBuy: bindActionCreators(initPaymentInstantBuy, dispatch),
  buyCryptoCod: bindActionCreators(buyCryptoCod, dispatch),
});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(FeedCreditCard));
