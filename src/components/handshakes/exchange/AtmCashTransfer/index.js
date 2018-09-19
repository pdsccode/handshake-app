/* eslint camelcase:0 */
/* eslint no-eval:0 */
/* eslint jsx-a11y/no-noninteractive-element-interactions:0 */


import iconBitcoinCash from '@/assets/images/icon/coin/bch.svg';
import React, { Component } from 'react';
import iconBitcoin from '@/assets/images/icon/coin/btc.svg';
import iconEthereum from '@/assets/images/icon/coin/eth.svg';
import qrCodeIcon from '@/assets/images/icon/qrcode-icon.png';
import loadingSVG from '@/assets/images/icon/loading.gif';
import Image from '@/components/core/presentation/Image';
import PropTypes from 'prop-types';
import createForm from '@/components/core/form/createForm';
import { fieldDropdown, fieldInput } from '@/components/core/form/customField';
import { required, number } from '@/components/core/form/validation';
import { CRYPTO_CURRENCY, CRYPTO_CURRENCY_NAME, API_URL, FIAT_CURRENCY } from '@/constants';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Field, change } from 'redux-form';
import { throttle, compact } from 'lodash';
import { getCashFromCrypto, sendAtmCashTransfer } from '@/reducers/exchange/action';
import { showAlert } from '@/reducers/app/action';
import { getErrorMessageFromCode } from '@/components/handshakes/exchange/utils';
import { validateSpecificAmount } from '@/components/handshakes/exchange/validation';
import { Ethereum } from '@/services/Wallets/Ethereum.js';
import { Bitcoin } from '@/services/Wallets/Bitcoin';
import { BitcoinCash } from '@/services/Wallets/BitcoinCash';
import QrCodeScanner from './components/QrCodeScanner';
import './style.scss';

export const CRYPTO_ICONS = {
  [CRYPTO_CURRENCY.ETH]: iconEthereum,
  [CRYPTO_CURRENCY.BTC]: iconBitcoin,
  BCH: iconBitcoinCash,
};

const nameFormNewTransaction = 'newTransaction';

const CRYPTO_CURRENCY_CREDIT_CARD = {
  ...CRYPTO_CURRENCY, BCH: 'BCH',
};

const listCurrency = Object.values(CRYPTO_CURRENCY_CREDIT_CARD).map((item) => {
  return { id: item, text: <span><img alt={item} src={CRYPTO_ICONS[item]} width={24} /> {CRYPTO_CURRENCY_NAME[item]}</span> };
});

const FormNewTransaction = createForm({
  propsReduxForm: {
    form: nameFormNewTransaction,
    initialValues: {
      currency: listCurrency[0],
    },
  },
});

class AtmCashTransfer extends Component {
  constructor() {
    super();
    this.state = {
      amount: 0,
      currency: null,
      fiatCurrency: 0,
      fiatCurrencyUnit: FIAT_CURRENCY.USD,
      isTransferable: false,
      walletAddress: '',
    };

    this.qrCodeScanner = null;
    // binding
    this.onAmountChange = :: this.onAmountChange;
    this.getCashFromCrypto = throttle(::this.getCashFromCrypto, 1000, { leading: true });
    this.onSuccess = :: this.onSuccess;
    this.onError = :: this.onError;
    this.onTransfer = :: this.onTransfer;
    this.handleValidate = :: this.handleValidate;
    this.openQrScanner = :: this.openQrScanner;
    this.onQrCodeData = :: this.onQrCodeData;
    this.validateWallet = ::this.validateWallet;
    this.getMessage = :: this.getMessage;
  }

  static getDerivedStateFromProps(nextProps) {
    const { form: { values, syncErrors } } = nextProps;
    return {
      currency: values?.currency,
      walletAddress: values?.walletAddress,
      isTransferable: compact(Object.values(syncErrors || {})).length === 0,
    };
  }

  onAmountChange(e) {
    const amount = e?.target?.value;
    this.setState({ amount }, this.getCashFromCrypto);
  }

  onSuccess(res) {
    const { currency } = this.state;
    const { data } = res;

    if (currency.id === data?.currency) {
      this.setState({
        fiatCurrency: data?.fiat_amount || 0,
        fiatCurrencyUnit: data?.fiat_currency,
      });
    }
  }

  onError(e) {
    this.setState({ isTransferable: false });
    this.props.change(nameFormNewTransaction, 'amount', 0);
    this.props.change(nameFormNewTransaction, 'fiatAmount', 0);
    this.props.showAlert({
      message: <div className="text-center">{getErrorMessageFromCode(e)}</div>,
      timeOut: 3000,
      type: 'danger',
    });
  }

  onTransfer() {
    this.showLoading(true);
    const { messages: { atm_cash_transfer } } = this.props.intl;
    const { walletAddress, amount, currency, fiatCurrency, fiatCurrencyUnit } = this.state;
    const data = {
      address: walletAddress,
      amount,
      currency: currency.id,
      fiat_amount: fiatCurrency,
      fiat_currency: fiatCurrencyUnit,
    };

    this.props.sendAtmCashTransfer({
      PATH_URL: API_URL.EXCHANGE.SEND_ATM_CASH_TRANSFER,
      METHOD: 'POST',
      data,
      successFn: () => {
        this.showLoading(false);
        this.props.showAlert({
          message: <div className="text-center">{atm_cash_transfer?.success_msg}</div>,
          timeOut: 3000,
          type: 'success',
        });
      },
      errorFn: () => {
        this.showLoading(false);
      },
    });
  }

  onQrCodeData(data) {
    // append scanned data to wallet address
    this.props.change(nameFormNewTransaction, 'walletAddress', data);
  }

  getCashFromCrypto() {
    const { amount, currency } = this.state;
    const data = {
      amount,
      currency: currency.id,
    };

    this.props.getCashFromCrypto({
      PATH_URL: API_URL.EXCHANGE.CRYPTO_TO_CASH,
      qs: data,
      successFn: this.onSuccess,
      errorFn: this.onError,
    });
  }

  getMessage(str) {
    const { messages } = this.props.intl;
    let result = str;
    try {
      result = eval(str);
    } catch (e) {
      console.log(e);
    }
    return result;
  }

  validateWallet(walletAddress = '') {
    const { currency } = this.state;
    let wallet = null;
    const errors = {};

    if (currency?.id === CRYPTO_CURRENCY_CREDIT_CARD?.ETH) {
      wallet = new Ethereum();
    } else if (currency?.id === CRYPTO_CURRENCY_CREDIT_CARD?.BTC) {
      wallet = new Bitcoin();
    } else if (currency?.id === CRYPTO_CURRENCY_CREDIT_CARD?.BCH) {
      wallet = new BitcoinCash();
    }

    const error = wallet?.checkAddressValid(walletAddress);
    if (typeof error === 'string') {
      errors.walletAddress = this.getMessage(error);
    }
    return errors;
  }

  showLoading(isLoading = false) {
    this.setState({
      isLoading,
    });
  }

  openQrScanner() {
    // open qrcode modal
    this.qrCodeScanner.open();
  }

  handleValidate(values) {
    return { ...this.validateWallet(values.walletAddress), ...validateSpecificAmount(values, this.state, this.props) };
  }

  render() {
    const { fiatCurrencyUnit, fiatCurrency, isTransferable } = this.state;
    const { messages: { atm_cash_transfer } } = this.props.intl;
    return (
      <React.Fragment>
        <div className={`discover-overlay ${this.state.isLoading ? 'show' : ''}`}>
          <Image src={loadingSVG} alt="loading" width="100" />
        </div>
        <div className="new-transaction-container">
          <QrCodeScanner ref={qrcode => { this.qrCodeScanner = qrcode?.getWrappedInstance(); }} onData={this.onQrCodeData} />
          <FormNewTransaction className="form-new-transaction" onSubmit={this.onTransfer} validate={this.handleValidate}>
            <div className="group-el">
              <div className="form-el">
                <div className="input-with-trailing">
                  <label className="labelText">{atm_cash_transfer.to_wallet_address}</label>
                  <Field
                    name="walletAddress"
                    className="form-control transaction-input"
                    component={fieldInput}
                    placeholder={atm_cash_transfer.copy_address_or_scan_qr}
                    validate={[required]}
                  />
                  <img onClick={this.openQrScanner} className="prepend prepend-qrcode" src={qrCodeIcon} alt="" />
                </div>
              </div>
              <div className="form-el">
                <label className="labelText">{atm_cash_transfer.amount}</label>
                <div className="input-group">
                  <Field
                    name="amount"
                    className="form-control transaction-input"
                    type="text"
                    placeholder="0.0"
                    component={fieldInput}
                    onChange={this.onAmountChange}
                    validate={[required, number]}
                    elementAppend={
                      <Field
                        name="currency"
                        classNameWrapper=""
                        classNameDropdownToggle="dropdown-btn form-control transaction-input"
                        list={listCurrency}
                        component={fieldDropdown}
                      />
                    }
                  />
                </div>
                <div className="input-with-trailing">
                  <div className="prepend">{fiatCurrencyUnit}</div>
                  <Field
                    name="fiatAmount"
                    className="form-control transaction-input fiat-amount"
                    placeholder={fiatCurrency}
                    component={fieldInput}
                    disabled
                  />
                </div>
              </div>
            </div>
            <div className="form-el">
              <button disabled={!isTransferable} type="submit" className="btn submit-btn">
                <span>{atm_cash_transfer.transfer}</span>
              </button>
            </div>
          </FormNewTransaction>
        </div >
      </React.Fragment>
    );
  }
}

const mapState = (state) => {
  return {
    form: state?.form[nameFormNewTransaction] || {},
  };
};

AtmCashTransfer.propTypes = {
  getCashFromCrypto: PropTypes.func.isRequired,
  showAlert: PropTypes.func.isRequired,
  form: PropTypes.object.isRequired,
  change: PropTypes.func.isRequired,
  sendAtmCashTransfer: PropTypes.func.isRequired,
  intl: PropTypes.object.isRequired,
};

export default injectIntl(connect(mapState, ({ getCashFromCrypto, showAlert, change, sendAtmCashTransfer }))(AtmCashTransfer));
