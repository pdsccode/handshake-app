/* eslint react/sort-comp:0 */
import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
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
} from '@/reducers/exchange/action';
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

// const listPackages = {
//   [CRYPTO_CURRENCY.ETH]: [{ name: 'basic', amount: 0.1, fiatAmount: 0, show: false }, { name: 'pro', amount: 0.4, fiatAmount: 0, show: false }],
//   [CRYPTO_CURRENCY.BTC]: [{ name: 'basic', amount: 0.005, fiatAmount: 0, show: false }, { name: 'pro', amount: 0.01, fiatAmount: 0, show: false }],
//   BCH: [{ name: 'basic', amount: 0.1, fiatAmount: 0, show: false }, { name: 'pro', amount: 0.15, fiatAmount: 0, show: false }],
// };

const listFiatCurrency = [
  {
    id: FIAT_CURRENCY.USD,
    text: <span><img alt="" src={iconUsd} width={24} /> {FIAT_CURRENCY_NAME[FIAT_CURRENCY.USD]}</span>,
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
        text: <span><img alt="" src={iconBitcoin} width={22} /> {CRYPTO_CURRENCY_NAME[CRYPTO_CURRENCY.BTC]}</span>,
      },
      fiatCurrency: {
        id: FIAT_CURRENCY.USD,
        text: <span><img alt="" src={iconUsd} width={24} /> {FIAT_CURRENCY_NAME[FIAT_CURRENCY.USD]}</span>,
      },
      payment_method: PAYMENT_METHODS.BANK_TRANSFER,
    },
  },
});
const selectorFormSpecificAmount = formValueSelector(nameFormSpecificAmount);

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

  componentDidMount() {}

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
    const { amount, paymentMethod } = this.props;
    const { currency, allowBuy } = this.state;
    const canChangePaymentMethods = false;

    return (
      <div>
        <div className={`discover-overlay ${this.state.isLoading ? 'show' : ''}`}>
          <Image src={loadingSVG} alt="loading" width="100" />
        </div>
        <div className="choose-coin">
          <div className="specific-amount">
            <FormSpecificAmount onSubmit={this.handleSubmitSpecificAmount} validate={this.handleValidateSpecificAmount}>
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
                  disabled={!canChangePaymentMethods}
                />
              </div>
              <div className="mt-3 mb-3">
                <button type="submit" className="btn btn-lg btn-primary btn-block btn-submit-specific" disabled={!allowBuy}>
                  <img alt="" src={iconLock} width={20} className="align-top mr-2" /><span>{EXCHANGE_ACTION_NAME[EXCHANGE_ACTION.BUY]} {amount} {CRYPTO_CURRENCY_NAME[currency]}</span>
                </button>
              </div>
              {paymentMethod === 'cod' && this.renderCoD()}
            </FormSpecificAmount>
          </div>

          {/* <div className="by-package">
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
                            }
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
          </div> */}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  authProfile: state.auth.profile,
  amount: selectorFormSpecificAmount(state, 'amount'),
  paymentMethod: selectorFormSpecificAmount(state, 'paymentMethod'),
});

const mapDispatchToProps = (dispatch) => ({
  rfChange: bindActionCreators(change, dispatch),
  showAlert: bindActionCreators(showAlert, dispatch),
  buyCryptoCod: bindActionCreators(buyCryptoCod, dispatch),
});

BuyCryptoCoin.propTypes = {
  intl: PropTypes.object.isRequired,
  paymentMethod: PropTypes.string.isRequired,
  amount: PropTypes.string.isRequired,
};

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(BuyCryptoCoin));
