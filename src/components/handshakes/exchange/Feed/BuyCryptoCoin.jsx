/* eslint react/sort-comp:0 */
/* eslint camelcase: 0 */

import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, injectIntl } from 'react-intl';
import { change, Field, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import {
  API_URL, CRYPTO_CURRENCY, CRYPTO_CURRENCY_NAME, FIAT_CURRENCY, FIAT_CURRENCY_NAME, HANDSHAKE_ID,
  URL
} from '@/constants';
import createForm from '@/components/core/form/createForm';
import { fieldInput, fieldTextArea } from '@/components/core/form/customField';
import { required } from '@/components/core/form/validation';
import {
  buyCryptoGetBankInfo,
  buyCryptoGetCoinInfo,
  buyCryptoOrder,
  buyCryptoSaveRecipt,
} from '@/reducers/buyCoin/action';
import { bindActionCreators } from 'redux';
import debounce from '@/utils/debounce';
import { hideAlert, showAlert } from '@/reducers/app/action';
import iconBitcoin from '@/assets/images/icon/coin/btc.svg';
import iconEthereum from '@/assets/images/icon/coin/eth.svg';
import iconBitcoinCash from '@/assets/images/icon/coin/bch.svg';
import iconUsd from '@/assets/images/icon/coin/icons8-us_dollar.svg';
import Image from '@/components/core/presentation/Image';
import loadingSVG from '@/assets/images/icon/loading.gif';
import ConfirmButton from '@/components/handshakes/exchange/components/ConfirmButton';
import AtmCashTransferInfo from '@/components/handshakes/exchange/AtmCashTransferInfo';
import Modal from '@/components/core/controls/Modal/Modal';
import { formatMoney } from '@/services/offer-util';
import { getErrorMessageFromCode } from '@/components/handshakes/exchange/utils';
import walletSelectorField from './reduxFormFields/walletSelector';
import coinMoneyExchangeField from './reduxFormFields/coinMoneyExchangeField';
import coinMoneyExchangeValidator from './reduxFormFields/coinMoneyExchangeField/validator';
import walletSelectorValidator from './reduxFormFields/walletSelector/validator';
import '../styles.scss';
import './BuyCryptoCoin.scss';
import { Link } from 'react-router-dom';
import IdVerifyBtn from '@/components/handshakes/exchange/Feed/components/IdVerifyBtn';

export const CRYPTO_ICONS = {
  [CRYPTO_CURRENCY.ETH]: iconEthereum,
  [CRYPTO_CURRENCY.BTC]: iconBitcoin,
  BCH: iconBitcoinCash,
};

export const GLOBAL_BANK = 'XX';

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
      isLoading: false,
      forcePaymentMethod: null,
      modalContent: null,
      modalTitle: null,
      walletAddress: null,
    };

    this.modalRef = null;

    this.getCoinInfoNoBounce = ::this.getCoinInfoNoBounce;
    this.getCoinInfo = debounce(::this.getCoinInfoNoBounce, 1000);
    this.getBasePrice = :: this.getBasePrice;
    this.getBankDataByCountry = :: this.getBankDataByCountry;
    this.renderBankInfo = :: this.renderBankInfo;
  }

  componentDidCatch(e) {
    console.warn(e);
  }

  componentDidMount() {
    const { country } = this.props;
    this.getBasePrice(this.props.wallet?.currency);
    this.updatePhoneNumber(this.props.authProfile?.phone);

    // need to get bank info in user country, global bank also
    this.getBankInfoFromCountry(); // global bank by default
    this.getBankInfoFromCountry(country);

    // this.checkUserVerified();
  }

  checkUserVerified = () => {
    const { messages } = this.props.intl;
    const { authProfile: { idVerified } } = this.props;

    let timeShow = 0;
    let idVerificationStatusText = 'Rejected';

    switch (idVerified) {
      case 0: {
        idVerificationStatusText = <span>{messages.buy_coin.label.verify.notYet.title} <Link to={URL.HANDSHAKE_ME_PROFILE}>{messages.buy_coin.label.verify.notYet.action}</Link></span>;
        timeShow = 24 * 60 * 60 * 1000;
        break;
      }
      case -1: {
        idVerificationStatusText = <span>{messages.buy_coin.label.verify.rejected.title} <Link to={URL.HANDSHAKE_ME_PROFILE}>{messages.buy_coin.label.verify.rejected.action}</Link></span>;
        timeShow = 24 * 60 * 60 * 1000;
        break;
      }
      case 1: {
        idVerificationStatusText = 'Verified';
        break;
      }
      case 2: {
        idVerificationStatusText = <span>{messages.buy_coin.label.verify.processing.title} <Link to={URL.HANDSHAKE_ME_PROFILE}>{messages.buy_coin.label.verify.processing.action}</Link></span>;
        timeShow = 24 * 60 * 60 * 1000;
        break;
      }
      default: {
        idVerificationStatusText = 'Default';
      }
    }

    if (timeShow > 0) {
      this.props.showAlert({
        message: <div className="text-center">
          {idVerificationStatusText}
        </div>,
        timeOut: timeShow,
        type: 'danger',
        callBack: () => {
        },
      });
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { country, authProfile, wallet, fiatAmountOverLimit } = nextProps;

    // update phone number from props
    if (authProfile?.phone !== this.props.authProfile?.phone) {
      this.updatePhoneNumber(authProfile?.phone);
    }

    if (wallet?.currency !== this.props.wallet?.currency) {
      this.getBasePrice(wallet?.currency);
      this.setState({ currency: wallet?.currency });
    }

    if (fiatAmountOverLimit !== this.props.fiatAmountOverLimit) {
      if (fiatAmountOverLimit) {
        this.setState({ forcePaymentMethod: PAYMENT_METHODS.BANK_TRANSFER }, () => {
          this.updatePaymentMethod(this.state.forcePaymentMethod);
        });
      } else {
        this.setState({ forcePaymentMethod: null });
      }
    }

    // get bank info if country change
    if (country !== this.props.country) {
      this.getBankInfoFromCountry(country);
    }

    if (wallet?.walletAddress !== this.props.wallet?.walletAddress) {
      this.setState({ walletAddress: wallet?.walletAddress });
    }
  }

  onCountryChange = (country) => {
    this.getBankInfoFromCountry(country);
  }

  getBankInfoFromCountry = (country = GLOBAL_BANK) => {
    this.props.buyCryptoGetBankInfo({
      PATH_URL: `${API_URL.EXCHANGE.BUY_CRYPTO_GET_BANK_INFO}/${country}`,
    });
  }

  updatePhoneNumber = (phone) => {
    phone && this.props.rfChange(nameBuyCryptoForm, 'phone', phone);
  }

  updatePaymentMethod = (method) => {
    if (Object.values(PAYMENT_METHODS).indexOf(method) === -1) {
      return;
    }
    this.props.rfChange(nameBuyCryptoForm, 'paymentMethod', method);
  }

  isOverLimit = (amountInUsd, limit) => {
    const { coinInfo } = this.props;
    let amount = Number.parseFloat(amountInUsd);
    let limitAmount = Number.parseFloat(limit);
    amount = !Number.isNaN(amount) ? amount : coinInfo.fiatAmount;
    limitAmount = !Number.isNaN(limitAmount) ? limitAmount : coinInfo.limit;
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

  getBasePrice(currentIdFromInput, amountFromInput) {
    const { wallet } = this.props;
    const _currencyId = currentIdFromInput || wallet.currency;
    this.getCoinInfoNoBounce({
      isGetBasePrice: true,
      currencyId: _currencyId,
      amount: amountFromInput || 1,
    });
  }

  getCoinInfoNoBounce(data = {}) {
    const { amount, currencyId, isGetBasePrice } = data;
    const { wallet, currencyByLocal } = this.props;
    const fiatCurrencyId = isGetBasePrice ? FIAT_CURRENCY.USD : currencyByLocal;
    const _currencyId = currencyId || wallet.currency;
    const parsedAmount = Number.parseFloat(amount || this.props.amount) || null;
    if (parsedAmount && _currencyId && fiatCurrencyId) {
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
    const { country } = this.props;
    const { coinInfo, paymentMethod, address, noteAndTime, phone, coinMoneyExchange } = this.props;
    const { walletAddress, currency } = this.state;
    const fiatAmount = info.fiatAmount || coinMoneyExchange.fiatAmount;
    const data = {
      type: info.paymentMethod || paymentMethod,
      amount: String(info.amount || coinMoneyExchange.amount),
      currency: info.currencyId || currency,
      fiat_amount: String(coinMoneyExchange.fiatAmountInUsd),
      fiat_currency: FIAT_CURRENCY.USD,
      fiat_local_amount: String(fiatAmount),
      fiat_local_currency: info.fiatCurrencyId || coinMoneyExchange.fiatCurrency,
      address: info.address || walletAddress,
    };

    if (!this.isOverLimit(fiatAmount)) {
      data.fiat_local_amount = String(info.fiatLocalAmount || coinInfo.fiatLocalAmount);
      data.fiat_local_currency = info.fiatLocalCurrencyId || coinInfo.fiatLocalCurrency;
    }

    if (data.type === PAYMENT_METHODS.COD) {
      data.fiat_local_amount = String(info.fiatLocalAmountCod || coinInfo.fiatLocalAmountCod);
    } else {
      const globalBank = GLOBAL_BANK;
      if (this.isOverLimit(fiatAmount)) {
        data.center = globalBank; // global bank
      } else {
        data.center = country || globalBank;
      }
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
      errorFn: this.onMakeOrderFailed,
    });
  }

  onMakeOrderFailed = (e) => {
    this.props.showAlert({
      message: getErrorMessageFromCode(e),
      timeOut: 3000,
      type: 'danger',
    });
  }

  onMakeOrderSuccess = () => {
    const { messages } = this.props.intl;
    const { order } = this.props;
    if (order.type === PAYMENT_METHODS.COD) {
      this.props.showAlert({
        message: <div className="text-center">{messages.buy_coin.label.success}</div>,
        timeOut: 3000,
        type: 'success',
        callBack: () => {
          this.props.history.push(`${URL.HANDSHAKE_ME}?id=${HANDSHAKE_ID.NINJA_COIN}`);
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

  renderOrderInfo = () => {
    const { modalContent, modalTitle } = this.state;
    return (
      <Modal title={modalTitle} onRef={modal => { this.modalRef = modal; }} onClose={() => {}}>
        {modalContent || ''}
      </Modal>
    );
  }

  handleBuyViaTransfer = (order = {}) => {
    const { country } = this.props;
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
      bankData = this.getBankDataByCountry(); // global bank
    } else {
      bankData = this.getBankDataByCountry(country);
      receipt.amount = order.fiatLocalAmount;
      receipt.fiatCurrency = order.fiatLocalCurrency;
    }
    this.setState({
      modalContent: (
        <AtmCashTransferInfo
          receipt={receipt}
          bankInfo={bankData}
          saveReceiptHandle={this.saveReceiptHandle}
          onDone={this.onReceiptSaved}
        />
      ),
      modalTitle: 'Bank Transfer',
    }, () => {
      this.modalRef.open();
    });
  }

  onReceiptSaved = () => {
    this.modalRef.close();
    this.props.history.push(`${URL.HANDSHAKE_ME}?id=${HANDSHAKE_ID.NINJA_COIN}`);
  }

  getBankDataByCountry(country = GLOBAL_BANK) {
    const { bankInfo } = this.props;
    if (country in bankInfo) {
      return bankInfo[country];
    }
    return null;
  }

  handleBuyPackage = (item = {}) => {
    const { walletAddress, currency } = this.state;
    const data = {
      paymentMethod: PAYMENT_METHODS.BANK_TRANSFER,
      amount: String(this.getAmountFromFiatAmount(item.fiatAmount, currency)),
      currencyId: currency,
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
      <React.Fragment>
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
      </React.Fragment>
    );
  }

  renderBankInfo() {
    const { coinMoneyExchange, country, intl: { messages } } = this.props;
    const overLimit = coinMoneyExchange?.isOverLimit;
    const bankData = overLimit ? this.getBankDataByCountry() : this.getBankDataByCountry(country);

    if (!bankData) return null;
    return (
      <React.Fragment>
        <ul className="bank-info-container">
          {bankData && Object.entries(bankData).map(([key, value]) => {
            return (
              <li key={key}>
                <div><span>{messages.bank_info[key]}</span></div>
                <div><span>{value}</span></div>
              </li>
            );
          })}
        </ul>
      </React.Fragment>
    );
  }

  renderPaymentMethodInfo() {
    const { paymentMethod } = this.props;
    return (
      <div className={`choose-coin-payment-method-container ${paymentMethod === PAYMENT_METHODS.COD ? 'cod' : 'bank'}`}>
        {paymentMethod === PAYMENT_METHODS.COD && this.renderCoD()}
        {paymentMethod === PAYMENT_METHODS.BANK_TRANSFER && this.renderBankInfo()}
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

  componentWillUnmount() {
    this.props.hideAlert();
  }

  render() {
    console.log('STATE', this.state);
    const { authProfile: { idVerified } } = this.props;
    const { messages } = this.props.intl;
    const { coinMoneyExchange, paymentMethod } = this.props;
    const { currency, forcePaymentMethod } = this.state;

    const showState = [-1, 0, 2];

    return (
      <div>
        <div className={`discover-overlay ${this.state.isLoading ? 'show' : ''}`}>
          <Image src={loadingSVG} alt="loading" width="100" />
        </div>
        <div className="choose-coin">
          {
            showState.indexOf(idVerified) > 0 && <IdVerifyBtn dispatch={this.props.dispatch} idVerified={idVerified} />
          }
          <div className="specific-amount">
            <FormBuyCrypto onSubmit={this.onSubmit} validate={this.handleValidateSpecificAmount}>
              <div className="label-1">{messages.buy_coin.label.header}</div>
              <div className="label-2">{messages.buy_coin.label.description}</div>
              <div className="input-group mt-4">
                <Field
                  name="wallet"
                  className="form-control form-control-lg border-0 rounded-right form-control-cc"
                  type="text"
                  component={walletSelectorField}
                  validate={[walletSelectorValidator]}
                />
              </div>
              <div className="input-group mt-4">
                <Field
                  name="coinMoneyExchange"
                  className="form-control form-control-lg border-0 rounded-right form-control-cc"
                  type="text"
                  component={coinMoneyExchangeField}
                  currency={currency}
                  paymentMethod={paymentMethod}
                  validate={[coinMoneyExchangeValidator]}
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
              {this.renderPaymentMethodInfo()}
              <div className="input-group mt-2">
                <ConfirmButton
                  label={`${messages.create.cod_form.buy_btn} ${coinMoneyExchange?.amount || '---'} ${CRYPTO_CURRENCY_NAME[currency] || ''}`}
                  buttonClassName="buy-btn"
                  containerClassName="buy-btn-container"
                  message={
                    <FormattedMessage
                      id="buy_coin_confirm_popup.msg"
                      values={{
                        amount: coinMoneyExchange.amount,
                        currency,
                        fiatAmount: formatMoney(coinMoneyExchange.fiatAmount),
                        fiatCurrency: coinMoneyExchange.fiatCurrency,
                      }}
                    />
                  }
                />
              </div>
            </FormBuyCrypto>
          </div>

          {this.renderPackages()}
          {this.renderOrderInfo()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  currencyByLocal: state.app.ipInfo.currency || 'VND',
  country: state.app.ipInfo.country || 'VN',
  authProfile: state.auth.profile,
  amount: selectorFormSpecificAmount(state, 'amount'),
  phone: selectorFormSpecificAmount(state, 'phone'),
  currency: selectorFormSpecificAmount(state, 'currency'),
  fiatCurrency: selectorFormSpecificAmount(state, 'fiatCurrency'),
  paymentMethod: selectorFormSpecificAmount(state, 'paymentMethod'),
  address: selectorFormSpecificAmount(state, 'address'),
  noteAndTime: selectorFormSpecificAmount(state, 'noteAndTime'),
  wallet: selectorFormSpecificAmount(state, 'wallet'),
  coinMoneyExchange: selectorFormSpecificAmount(state, 'coinMoneyExchange'),
  fiatAmountOverLimit: state.buyCoin?.fiatAmountOverLimit,
  coinInfo: state.buyCoin?.coinInfo || {},
  basePrice: state.buyCoin?.basePrice || {},
  bankInfo: state.buyCoin?.bankInfo,
  order: state.buyCoin?.order || {},
});

const mapDispatchToProps = (dispatch) => ({
  rfChange: bindActionCreators(change, dispatch),
  showAlert: bindActionCreators(showAlert, dispatch),
  hideAlert: bindActionCreators(hideAlert, dispatch),
  buyCryptoOrder: bindActionCreators(buyCryptoOrder, dispatch),
  buyCryptoGetCoinInfo: bindActionCreators(buyCryptoGetCoinInfo, dispatch),
  buyCryptoGetBankInfo: bindActionCreators(buyCryptoGetBankInfo, dispatch),
  buyCryptoSaveRecipt: bindActionCreators(buyCryptoSaveRecipt, dispatch),
});

BuyCryptoCoin.defaultProps = {
  amount: 0,
  paymentMethod: PAYMENT_METHODS.BANK_TRANSFER,
  fiatCurrency: defaultFiatCurrency,
  bankInfo: {},
  address: '',
  noteAndTime: '',
  order: {},
  phone: '',
  wallet: {},
  coinMoneyExchange: {},
};

BuyCryptoCoin.propTypes = {
  intl: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  country: PropTypes.string.isRequired,
  authProfile: PropTypes.object.isRequired,
  coinMoneyExchange: PropTypes.object.isRequired,
  paymentMethod: PropTypes.string,
  amount: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  buyCryptoGetCoinInfo: PropTypes.func.isRequired,
  currencyByLocal: PropTypes.string.isRequired,
  rfChange: PropTypes.func.isRequired,
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
  hideAlert: PropTypes.func,
  phone: PropTypes.string,
  wallet: PropTypes.object,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(BuyCryptoCoin));
