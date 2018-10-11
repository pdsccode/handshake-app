/* eslint react/sort-comp:0 */
/* eslint camelcase: 0 */

import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import { change, Field, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import {
  URL,
  API_URL,
  CRYPTO_CURRENCY,
  CRYPTO_CURRENCY_NAME,
  FIAT_CURRENCY,
  FIAT_CURRENCY_NAME,
} from '@/constants';
import createForm from '@/components/core/form/createForm';
import { fieldDropdown, fieldInput, fieldTextArea } from '@/components/core/form/customField';
import { required } from '@/components/core/form/validation';
import {
  buyCryptoOrder,
  buyCryptoGetCoinInfo,
  buyCryptoGetBankInfo,
  buyCryptoSaveRecipt,
} from '@/reducers/buyCoin/action';
import { bindActionCreators } from 'redux';
import { showAlert } from '@/reducers/app/action';
import iconBitcoin from '@/assets/images/icon/coin/btc.svg';
import iconEthereum from '@/assets/images/icon/coin/eth.svg';
import iconBitcoinCash from '@/assets/images/icon/coin/bch.svg';
import iconUsd from '@/assets/images/icon/coin/icons8-us_dollar.svg';
import Image from '@/components/core/presentation/Image';
import loadingSVG from '@/assets/images/icon/loading.gif';
import ConfirmButton from '@/components/handshakes/exchange/components/ConfirmButton';
import AtmCashTransferInfo from '@/components/handshakes/exchange/AtmCashTransferInfo';
import WalletSelector from '@/components/handshakes/exchange/Feed/components/WalletSelector';
import Modal from '@/components/core/controls/Modal/Modal';
import { formatMoney } from '@/services/offer-util';
import { getErrorMessageFromCode } from '@/components/handshakes/exchange/utils';

import '../styles.scss';
import './BuyCryptoCoin.scss';

export const CRYPTO_ICONS = {
  [CRYPTO_CURRENCY.ETH]: iconEthereum,
  [CRYPTO_CURRENCY.BTC]: iconBitcoin,
  BCH: iconBitcoinCash,
};

const CRYPTO_CURRENCY_CREDIT_CARD = {
  ...CRYPTO_CURRENCY, BCH: 'BCH',
};

const listCurrency = Object.values(CRYPTO_CURRENCY_CREDIT_CARD).map((item) => {
  return { id: item, text: <span><img alt="" src={CRYPTO_ICONS[item]} width={24} /> {CRYPTO_CURRENCY_NAME[item]}</span> };
});

const listFiatCurrency = Object.values(FIAT_CURRENCY).map((item) => {
  return {
    id: item,
    text: <span><img alt="" src={iconUsd} width={24} /> {FIAT_CURRENCY_NAME[item]}</span>,
  };
});

const listPackages = [
  { name: 'basic', fiatAmount: 1000, amount: 0, show: true },
  { name: 'pro', fiatAmount: 2000, amount: 0, show: true },
];

const defaultFiatCurrency = {
  id: FIAT_CURRENCY.USD,
  text: <span><img alt="" src={iconUsd} width={24} /> {FIAT_CURRENCY_NAME[FIAT_CURRENCY.USD]}</span>,
};

const defaultCurrency = {
  id: CRYPTO_CURRENCY.BTC,
  text: <span><img alt="" src={iconBitcoin} width={22} /> {CRYPTO_CURRENCY_NAME[CRYPTO_CURRENCY.BTC]}</span>,
};

const getFiatCurrency = (currency) => {
  if (FIAT_CURRENCY[currency]) {
    return {
      id: FIAT_CURRENCY[currency],
      text: <span><img alt="" src={iconUsd} width={24} /> {FIAT_CURRENCY_NAME[FIAT_CURRENCY[currency]]}</span>,
    };
  }
  return defaultFiatCurrency;
};

export const PAYMENT_METHODS = {
  BANK_TRANSFER: 'bank',
  COD: 'cod',
};

const nameBuyCryptoForm = 'buyCryptoForm';
const FormBuyCrypto = createForm({
  propsReduxForm: {
    form: nameBuyCryptoForm,
    initialValues: {
      currency: defaultCurrency,
      fiatCurrency: {
        id: FIAT_CURRENCY.USD,
        text: <span><img alt="" src={iconUsd} width={24} /> {FIAT_CURRENCY_NAME[FIAT_CURRENCY.USD]}</span>,
      },
      paymentMethod: PAYMENT_METHODS.BANK_TRANSFER,
    },
  },
});
const selectorFormSpecificAmount = formValueSelector(nameBuyCryptoForm);

export const fieldCheckBoxList = ({ input, name, titles, items, disabled = false }) => {
  const { onChange, value } = input;
  return (
    <div className="rf-type-atm-container d-table w-100" onChange={({ target }) => onChange(target.value)}>
      {Object.entries(items).map(([key, itemValue]) => {
        console.log('key, item_value ', key, itemValue);
        const label = titles[itemValue];
        console.log('titels', titles, label);
        return (
          <label key={key} className="radio-inline rf-type-atm-radio-container d-table-cell w-50">
            <input
              value={itemValue}
              type="radio"
              name={name}
              checked={value === itemValue}
              onChange={() => null}
              disabled={disabled}
            />
            <span className={`checkmark ${disabled && value !== itemValue && 'disabled'}`} />
            <span className={`${disabled && value !== itemValue && 'disabled'}`}>{label}</span>
          </label>
        );
      })}
    </div>
  );
};

class BuyCryptoCoin extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currency: CRYPTO_CURRENCY.BTC,
      allowBuy: true,
      isLoading: false,
      forcePaymentMethod: null,
      modalContent: null,
      modalTitle: null,
      fiatCurrency: null,
      walletAddress: null,
      walletSelectorType: CRYPTO_CURRENCY.BTC,
    };

    this.modalRef = null;
  }

  componentDidMount() {
    const { country } = this.props;
    this.getCoinInfo({ isGetBasePrice: true, amount: 1 });
    this.updateFiatCurrency(this.props.currencyByLocal);
    this.updatePhoneNumber(this.props.authProfile?.phone);

    // need to get bank info in user country, global bank also
    this.getBankInfoFromCountry(); // global bank by default
    this.getBankInfoFromCountry(country);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { currencyByLocal, amount, coinInfo, currency, paymentMethod, country, authProfile } = nextProps;
    if (currencyByLocal !== this.props.currencyByLocal) {
      this.updateFiatCurrency(currencyByLocal);
    }

    // update phone number from props
    if (authProfile?.phone !== this.props.authProfile?.phone) {
      this.updatePhoneNumber(authProfile?.phone);
    }

    // get price of coin if amount or currency was changed
    if (amount !== this.props.amount) {
      this.getCoinInfo({ amount });
    }
    if (currency.id !== this.props.currency.id) {
      this.getCoinInfo({ currencyId: currency.id });
      this.getCoinInfo({ isGetBasePrice: true, amount: 1, currencyId: currency.id });
      this.setState({ currency: currency.id, walletSelectorType: currency.id });
    }

    if (coinInfo.fiatLocalAmount !== this.props.coinInfo.fiatLocalAmount || paymentMethod !== this.props.paymentMethod) {
      // if fiatAmount over limit => force use USD and bank transfer
      if (this.isOverLimit(coinInfo.fiatAmount, coinInfo.limit)) {
        this.updateFiatAmount(coinInfo.fiatAmount);
        this.updateFiatCurrency(coinInfo.fiatCurrency);
        this.setState({ forcePaymentMethod: PAYMENT_METHODS.BANK_TRANSFER }, () => {
          this.updatePaymentMethod(this.state.forcePaymentMethod);
        });
      } else {
        // show fiatAmount for bank mode
        if (paymentMethod === PAYMENT_METHODS.BANK_TRANSFER) {
          this.updateFiatAmount(coinInfo.fiatLocalAmount);
        } else if (paymentMethod === PAYMENT_METHODS.COD) {
          // show fiatAmount for COD mode
          this.updateFiatAmount(coinInfo.fiatLocalAmountCod);
        }
        this.updateFiatCurrency(coinInfo.fiatLocalCurrency);

        this.setState({ forcePaymentMethod: null });
      }
    }

    // get bank info if country change
    if (country !== this.props.country) {
      this.getBankInfoFromCountry(country);
    }
  }

  onCountryChange = (country) => {
    this.getBankInfoFromCountry(country);
  }

  getBankInfoFromCountry = (country = 'XX') => {
    this.props.buyCryptoGetBankInfo({
      PATH_URL: `${API_URL.EXCHANGE.BUY_CRYPTO_GET_BANK_INFO}/${country}`,
    });
  }

  updateFiatCurrency = (fiatCurrencyId) => {
    const fiatCurrency = getFiatCurrency(fiatCurrencyId);
    this.setState({
      fiatCurrency,
    });
    fiatCurrency && this.props.rfChange(nameBuyCryptoForm, 'fiatCurrency', fiatCurrency);
  }

  updatePhoneNumber = (phone) => {
    phone && this.props.rfChange(nameBuyCryptoForm, 'phone', phone);
  }

  updatePaymentMethod = (method) => {
    if (Object.values(PAYMENT_METHODS).indexOf(method) === -1) {
      return;
    }

    this.setState({
      paymentMethod: method,
    });
    this.props.rfChange(nameBuyCryptoForm, 'paymentMethod', method);
  }

  updateAmount= (amount) => {
    this.props.rfChange(nameBuyCryptoForm, 'amount', Number.parseFloat(amount) || 0);
  }

  updateFiatAmount = (amount) => {
    this.setState({
      fiatAmount: Number.parseFloat(amount),
    });
    amount && this.props.rfChange(nameBuyCryptoForm, 'fiatAmount', Number.parseFloat(amount) || 0);
  }

  isOverLimit = (amountInUsd, limit) => {
    const { coinInfo } = this.props;
    const amount = Number.parseFloat(amountInUsd || coinInfo?.fiatAmount) || 0;
    const limitAmount = Number.parseFloat(limit || coinInfo?.limit) || 0;
    return amount > limitAmount;
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

  saveReceiptHandle = ({ data, successFn, errorFn }) => {
    const { order } = this.props;
    this.props.buyCryptoSaveRecipt({
      PATH_URL: `${API_URL.EXCHANGE.BUY_CRYPTO_SAVE_RECEIPT}/${order?.id}`,
      METHOD: 'PUT',
      data,
      successFn,
      errorFn,
    });
  }

  onGetCoinInfoError = (e) => {
    this.updateAmount(0);
    this.props.showAlert({
      message: <div className="text-center">{getErrorMessageFromCode(e)}</div>,
      timeOut: 3000,
      type: 'danger',
    });
  }

  getCoinInfo = ({ amount, currencyId, isGetBasePrice }) => {
    const { currency, currencyByLocal } = this.props;
    const fiatCurrencyId = isGetBasePrice ? FIAT_CURRENCY.USD : currencyByLocal;
    const _currencyId = currencyId || this.props.currency.id;
    const parsedAmount = Number.parseFloat(amount || this.props.amount) || null;
    if (parsedAmount && currency && fiatCurrencyId) {
      this.props.buyCryptoGetCoinInfo({
        PATH_URL: `${API_URL.EXCHANGE.BUY_CRYPTO_GET_COIN_INFO}?amount=${parsedAmount}&currency=${_currencyId}&fiat_currency=${fiatCurrencyId}${isGetBasePrice ? '&check=1' : ''}`,
        more: isGetBasePrice && { isGetBasePrice, amount: parsedAmount, currencyId: _currencyId, fiatCurrencyId },
        errorFn: this.onGetCoinInfoError,
      });
    }
  }

  getAmountFromFiatAmount = (fiatAmountInUsd, currencyId) => {
    const { basePrice } = this.props;
    const info = basePrice[currencyId];
    if (!info) {
      return null;
    }
    const amount = Number.parseFloat(fiatAmountInUsd / info.fiatAmountInUsd) || 0.0;
    return amount.toFixed(3);
  };

  makeOrder = (info = {}) => {
    const { coinInfo, paymentMethod, amount, currency, address, noteAndTime, phone } = this.props;
    const { walletAddress } = this.state;
    const data = {
      type: info.paymentMethod || paymentMethod,
      amount: String(info.amount || amount),
      currency: info.currencyId || currency.id,
      fiat_amount: String(info.fiatAmount || coinInfo.fiatAmount),
      fiat_currency: info.fiatCurrencyId || coinInfo.fiatCurrency,
      fiat_local_amount: String(info.fiatLocalAmount || coinInfo.fiatLocalAmount),
      fiat_local_currency: info.fiatLocalCurrencyId || coinInfo.fiatLocalCurrency,
      address: info.address || walletAddress,
    };

    if (data.type === PAYMENT_METHODS.COD) {
      data.fiat_local_amount = String(info.fiatLocalAmountCod || coinInfo.fiatLocalAmountCod);
    }

    if (paymentMethod === PAYMENT_METHODS.COD) {
      data.user_info = info.userInfo || {
        address,
        noteAndTime,
        phone,
      };
    }

    console.log('Order payload', data);
    this.props.buyCryptoOrder({
      PATH_URL: API_URL.EXCHANGE.BUY_CRYPTO_ORDER,
      METHOD: 'POST',
      data,
      successFn: this.onMakeOrderSuccess,
    });
  }

  onMakeOrderSuccess = () => {
    const { order } = this.props;
    if (order.type === PAYMENT_METHODS.COD) {
      this.props.showAlert({
        message: <div className="text-center">Success!</div>,
        timeOut: 3000,
        type: 'success',
        callBack: () => {
          this.props.history.push(URL.HANDSHAKE_ME);
        },
      });
      return;
    }

    // if payment is bank transfer => show BANK INFO
    this.handleBuyViaTransfer(order);
  }

  onSubmit = () => {
    this.makeOrder();
  }

  renderBankInfo = () => {
    const { modalContent, modalTitle } = this.state;
    return (
      <Modal title={modalTitle} onRef={modal => { this.modalRef = modal; }} onClose={() => {}}>
        {modalContent || ''}
      </Modal>
    );
  }

  onWalletChange = (walletAddress) => {
    this.setState({ walletAddress });
  }

  handleBuyViaTransfer = (order = {}) => {
    const { bankInfo, country } = this.props;
    let bankData = {};
    const receipt = {
      createdAt: order.createdAt,
      amount: order.fiatAmount || 0,
      fiatCurrency: order.fiatCurrency,
      referenceCode: order.refCode,
      status: order.status,
      id: order.id,
    };

    // if fiatAmount over limit => use global bank, else local bank
    if (this.isOverLimit(receipt.amount)) {
      bankData = bankInfo.XX; // global bank
    } else {
      bankData = bankInfo[country] || bankInfo.XX;
      receipt.amount = order.fiatLocalAmount;
      receipt.fiatCurrency = order.fiatLocalCurrency;
    }
    this.setState({
      modalContent: (
        <AtmCashTransferInfo
          receipt={receipt}
          bankInfo={bankData}
          saveReceiptHandle={this.saveReceiptHandle}
          onDone={() => this.modalRef.close()}
        />
      ),
      modalTitle: 'Bank Transfer',
    }, () => {
      this.modalRef.open();
    });
  }

  handleBuyPackage = (item = {}) => {
    const { currency } = this.props;
    const { walletAddress } = this.state;
    const data = {
      paymentMethod: PAYMENT_METHODS.BANK_TRANSFER,
      amount: String(this.getAmountFromFiatAmount(item.fiatAmount, currency.id)),
      currencyId: currency.id,
      fiatAmount: String(item.fiatAmount),
      fiatCurrencyId: FIAT_CURRENCY.USD,
      fiatLocalAmount: String(item.fiatAmount),
      fiatLocalCurrencyId: FIAT_CURRENCY.USD,
      address: walletAddress,
    };
    this.makeOrder(data);
  }

  renderCoD = () => {
    const { intl: { messages }, paymentMethod } = this.props;
    return (
      <div className={`choose-coin-cod-form ${paymentMethod === PAYMENT_METHODS.COD ? 'show' : 'hidden'}`}>
        <div className="input-group mt-4">
          <Field
            type="text"
            className="form-control input-field"
            name="address"
            placeholder={messages.create.cod_form.your_address}
            component={fieldInput}
            validate={paymentMethod === PAYMENT_METHODS.COD ? [required] : null}
          />
        </div>
        <div className="input-group mt-2">
          <Field
            type="text"
            className="form-control input-field"
            name="phone"
            placeholder={messages.create.cod_form.your_phone}
            component={fieldInput}
            validate={paymentMethod === PAYMENT_METHODS.COD ? [required] : null}
          />
        </div>
        <div className="input-group mt-2">
          <Field
            type="text"
            className="form-control input-field"
            placeholder={messages.create.cod_form.time}
            name="noteAndTime"
            component={fieldTextArea}
            validate={paymentMethod === PAYMENT_METHODS.COD ? [required] : null}
          />
        </div>
      </div>
    );
  }

  renderPackages = () => {
    const { messages } = this.props.intl;
    const { currency } = this.state;
    return (
      <div className="by-package">
        <div className="my-3 p-label-choose">{messages.buy_coin.label.common_packages}</div>
        <div className="mb-5">
          {
            listPackages && listPackages.map((item, index) => {
              const {
                name, fiatAmount, show,
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
                      </div>
                      <div className="p-amount">{this.getAmountFromFiatAmount(fiatAmount, currency) || '---'} {currency}</div>
                    </div>
                    <div className="d-table-cell align-middle text-right">
                      <button className="btn btn-p-buy-now" onClick={() => this.handleBuyPackage(item)}><FormattedMessage id="cc.btn.buyNow" /></button>
                    </div>
                  </div>
                  { index < listPackages.length - 1 && <hr /> }
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }

  render() {
    console.log('STATE', this.state);
    const { messages } = this.props.intl;
    const { amount } = this.props;
    const { currency, forcePaymentMethod, walletSelectorType } = this.state;

    return (
      <div>
        <div className={`discover-overlay ${this.state.isLoading ? 'show' : ''}`}>
          <Image src={loadingSVG} alt="loading" width="100" />
        </div>
        <div className="choose-coin">
          <div className="specific-amount">
            <FormBuyCrypto onSubmit={this.onSubmit} validate={this.handleValidateSpecificAmount}>
              <div className="label-1">{messages.buy_coin.label.header}</div>
              <div className="label-2">{messages.buy_coin.label.description}</div>
              <WalletSelector onWalletChange={this.onWalletChange} walletSelectorType={walletSelectorType} />
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
                      classNameDropdownToggle="dropdown-button"
                      list={listCurrency}
                      component={fieldDropdown}
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
                  validate={[required]}
                  format={value => {
                    return this.props.amount ? formatMoney(value) : 0;
                  }}
                  elementAppend={
                    <Field
                      name="fiatCurrency"
                      classNameWrapper=""
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
                  name="paymentMethod"
                  items={PAYMENT_METHODS}
                  disabled={forcePaymentMethod}
                />
              </div>
              {this.renderCoD()}
              <div className="input-group mt-2">
                <ConfirmButton
                  label={`${messages.create.cod_form.buy_btn} ${amount} ${CRYPTO_CURRENCY_NAME[currency]}`}
                  buttonClassName="buy-btn"
                  containerClassName="buy-btn-container"
                />
              </div>
            </FormBuyCrypto>
          </div>

          {this.renderPackages()}
          {this.renderBankInfo()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  currencyByLocal: state.app.ipInfo.currency,
  country: state.app.ipInfo.country,
  authProfile: state.auth.profile,
  amount: selectorFormSpecificAmount(state, 'amount'),
  phone: selectorFormSpecificAmount(state, 'phone'),
  fiatAmount: selectorFormSpecificAmount(state, 'fiatAmount'),
  currency: selectorFormSpecificAmount(state, 'currency'),
  fiatCurrency: selectorFormSpecificAmount(state, 'fiatCurrency'),
  paymentMethod: selectorFormSpecificAmount(state, 'paymentMethod'),
  address: selectorFormSpecificAmount(state, 'address'),
  noteAndTime: selectorFormSpecificAmount(state, 'noteAndTime'),
  coinInfo: state.buyCoin?.coinInfo || {},
  basePrice: state.buyCoin?.basePrice || {},
  bankInfo: state.buyCoin?.bankInfo,
  order: state.buyCoin?.order || {},
});

const mapDispatchToProps = (dispatch) => ({
  rfChange: bindActionCreators(change, dispatch),
  showAlert: bindActionCreators(showAlert, dispatch),
  buyCryptoOrder: bindActionCreators(buyCryptoOrder, dispatch),
  buyCryptoGetCoinInfo: bindActionCreators(buyCryptoGetCoinInfo, dispatch),
  buyCryptoGetBankInfo: bindActionCreators(buyCryptoGetBankInfo, dispatch),
  buyCryptoSaveRecipt: bindActionCreators(buyCryptoSaveRecipt, dispatch),
});

BuyCryptoCoin.defaultProps = {
  amount: 0,
  fiatAmount: 0,
  paymentMethod: PAYMENT_METHODS.BANK_TRANSFER,
  fiatCurrency: defaultFiatCurrency,
  currency: defaultCurrency,
  bankInfo: {},
  address: '',
  noteAndTime: '',
  order: {},
  phone: '',
};

BuyCryptoCoin.propTypes = {
  intl: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  country: PropTypes.string.isRequired,
  authProfile: PropTypes.object.isRequired,
  paymentMethod: PropTypes.string,
  amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  buyCryptoGetCoinInfo: PropTypes.func.isRequired,
  currencyByLocal: PropTypes.string.isRequired,
  rfChange: PropTypes.func.isRequired,
  currency: PropTypes.object,
  order: PropTypes.object,
  coinInfo: PropTypes.object.isRequired,
  basePrice: PropTypes.object.isRequired,
  bankInfo: PropTypes.object,
  buyCryptoGetBankInfo: PropTypes.func.isRequired,
  address: PropTypes.string,
  noteAndTime: PropTypes.string,
  buyCryptoOrder: PropTypes.func.isRequired,
  buyCryptoSaveRecipt: PropTypes.func.isRequired,
  showAlert: PropTypes.func.isRequired,
  phone: PropTypes.string,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(BuyCryptoCoin));
