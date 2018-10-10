/* eslint react/sort-comp:0 */
import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, FormattedMessage } from 'react-intl';
import { change, Field, formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import {
  API_URL,
  CRYPTO_CURRENCY,
  CRYPTO_CURRENCY_NAME,
  EXCHANGE_ACTION,
  EXCHANGE_ACTION_NAME,
  FIAT_CURRENCY,
  FIAT_CURRENCY_NAME,
} from '@/constants';
import createForm from '@/components/core/form/createForm';
import { fieldDropdown, fieldInput, fieldTextArea } from '@/components/core/form/customField';
import { required } from '@/components/core/form/validation';
import {
  buyCryptoCod,
  buyCryptoGetCoinInfo,
} from '@/reducers/buyCoin/action';
import { bindActionCreators } from 'redux';
import { showAlert } from '@/reducers/app/action';
import iconBitcoin from '@/assets/images/icon/coin/btc.svg';
import iconEthereum from '@/assets/images/icon/coin/eth.svg';
import iconBitcoinCash from '@/assets/images/icon/coin/bch.svg';
import iconUsd from '@/assets/images/icon/coin/icons8-us_dollar.svg';
import iconLock from '@/assets/images/icon/icons8-lock_filled.svg';
import Image from '@/components/core/presentation/Image';
import loadingSVG from '@/assets/images/icon/loading.gif';
import ConfirmButton from '@/components/handshakes/exchange/components/ConfirmButton';
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
  BANK_TRANSFER: 'bank_transfer',
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
            <span className="checkmark" />
            <span>{label}</span>
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
    };
  }

  componentDidMount() {
    this.getCoinInfo({ isGetBasePrice: true, amount: 1 });
    this.updateFiatCurrency(this.props.currencyByLocal);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { currencyByLocal, amount, coinInfo, currency, paymentMethod } = nextProps;
    const state = {};

    // check force payment method, if fiatAmount > limit => force to bank transfer & fiatCurrency must be USD
    if (coinInfo && (coinInfo.fiatAmount >= coinInfo.limit)) {
      state.forcePaymentMethod = PAYMENT_METHODS.BANK_TRANSFER;
      this.updatePaymentMethod(PAYMENT_METHODS.BANK_TRANSFER);
    } else {
      state.forcePaymentMethod = null;
    }

    if (currencyByLocal !== this.props.currencyByLocal) {
      this.updateFiatCurrency(currencyByLocal);
    }

    // get price of coin if amount or currency was changed
    if (amount !== this.props.amount) {
      this.getCoinInfo({ amount });
    }
    if (currency.id !== this.props.currency.id) {
      this.getCoinInfo({ currencyId: currency.id });
      this.getCoinInfo({ isGetBasePrice: true, amount: 1, currencyId: currency.id });
      this.setState({ currency: currency.id });
    }

    if (coinInfo.fiatLocalAmount !== this.props.coinInfo.fiatLocalAmount || paymentMethod !== this.props.paymentMethod) {
      // show fiatAmount for bank mode
      if (paymentMethod === PAYMENT_METHODS.BANK_TRANSFER) {
        this.updateFiatAmount(coinInfo.fiatLocalAmount);
        this.updateFiatCurrency(coinInfo.fiatLocalCurrency);
      } else if (paymentMethod === PAYMENT_METHODS.COD) {
        // show fiatAmount for COD mode
        this.updateFiatAmount(coinInfo.fiatLocalAmountCod);
        this.updateFiatCurrency(coinInfo.fiatLocalCurrency);
      }
    }

    this.setState({ ...state });
  }

  updateFiatCurrency = (fiatCurrencyId) => {
    const fiatCurrency = getFiatCurrency(fiatCurrencyId);
    this.setState({
      fiatCurrency,
    });
    fiatCurrency && this.props.rfChange(nameBuyCryptoForm, 'fiatCurrency', fiatCurrency);
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

  updateFiatAmount = (amount) => {
    this.setState({
      fiatAmount: amount,
    });
    amount && this.props.rfChange(nameBuyCryptoForm, 'fiatAmount', Number.parseFloat(amount) || 0);
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

  onReceiptSaved = () => {
    this.modalRef.close();
  }

  getCoinInfo = ({ amount, fiatCurrencyId, currencyId, isGetBasePrice }) => {
    const { currency } = this.props;
    const _fiatCurrencyId = fiatCurrencyId || this.props.fiatCurrency.id;
    const _currencyId = currencyId || this.props.currency.id;
    const parsedAmount = Number.parseFloat(amount || this.props.amount) || null;
    if (parsedAmount && currency && _fiatCurrencyId) {
      this.props.buyCryptoGetCoinInfo({
        PATH_URL: `${API_URL.EXCHANGE.BUY_CRYPTO_GET_COIN_INFO}?amount=${parsedAmount}&currency=${_currencyId}&fiat_currency=${_fiatCurrencyId}`,
        more: isGetBasePrice && { isGetBasePrice, amount: parsedAmount, currencyId: _currencyId, fiatCurrencyId: _fiatCurrencyId },
      });
    }
  }

  onBuy = () => {
    this.buyCryptoCod({
      PATH_URL: API_URL.EXCHANGE.BUY_CRYPTO_COD,
      successFn: this.handleBuyCryptoCodSuccess,
      errorFn: this.handleBuyCryptoCodFailed,
    });
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
          <div className="input-group mt-2">
            <ConfirmButton
              label={messages.create.cod_form.buy_btn}
              buttonClassName="buy-btn"
              containerClassName="buy-btn-container"
              onConfirm={this.onBuy}
            />
          </div>
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
                      <button className="btn btn-p-buy-now" onClick={() => alert('Implement!')}><FormattedMessage id="cc.btn.buyNow" /></button>
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
    const { amount, paymentMethod } = this.props;
    const { currency, allowBuy, forcePaymentMethod } = this.state;

    return (
      <div>
        <div className={`discover-overlay ${this.state.isLoading ? 'show' : ''}`}>
          <Image src={loadingSVG} alt="loading" width="100" />
        </div>
        <div className="choose-coin">
          <div className="specific-amount">
            <FormBuyCrypto onSubmit={this.handleSubmitSpecificAmount} validate={this.handleValidateSpecificAmount}>
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
              {paymentMethod === PAYMENT_METHODS.COD ? this.renderCoD() : (
                <div className="mt-3 mb-3">
                  <button type="submit" className="btn btn-lg btn-primary btn-block btn-submit-specific" disabled={!allowBuy}>
                    <img alt="" src={iconLock} width={20} className="align-top mr-2" /><span>{EXCHANGE_ACTION_NAME[EXCHANGE_ACTION.BUY]} {amount} {CRYPTO_CURRENCY_NAME[currency]}</span>
                  </button>
                </div>
              )}
            </FormBuyCrypto>
          </div>

          {this.renderPackages()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  currencyByLocal: state.app.ipInfo.currency,
  authProfile: state.auth.profile,
  amount: selectorFormSpecificAmount(state, 'amount'),
  fiatAmount: selectorFormSpecificAmount(state, 'fiatAmount'),
  currency: selectorFormSpecificAmount(state, 'currency'),
  fiatCurrency: selectorFormSpecificAmount(state, 'fiatCurrency'),
  paymentMethod: selectorFormSpecificAmount(state, 'paymentMethod'),
  coinInfo: state.buyCoin?.coinInfo || {},
  basePrice: state.buyCoin?.basePrice || {},
});

const mapDispatchToProps = (dispatch) => ({
  rfChange: bindActionCreators(change, dispatch),
  showAlert: bindActionCreators(showAlert, dispatch),
  buyCryptoCod: bindActionCreators(buyCryptoCod, dispatch),
  buyCryptoGetCoinInfo: bindActionCreators(buyCryptoGetCoinInfo, dispatch),
});

BuyCryptoCoin.defaultProps = {
  amount: 0,
  paymentMethod: PAYMENT_METHODS.BANK_TRANSFER,
  fiatCurrency: defaultFiatCurrency,
  currency: defaultCurrency,
};

BuyCryptoCoin.propTypes = {
  intl: PropTypes.object.isRequired,
  paymentMethod: PropTypes.string,
  amount: PropTypes.number,
  buyCryptoGetCoinInfo: PropTypes.func.isRequired,
  currencyByLocal: PropTypes.string.isRequired,
  rfChange: PropTypes.func.isRequired,
  currency: PropTypes.object,
  fiatCurrency: PropTypes.object,
  coinInfo: PropTypes.object.isRequired,
  basePrice: PropTypes.object.isRequired,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(BuyCryptoCoin));
