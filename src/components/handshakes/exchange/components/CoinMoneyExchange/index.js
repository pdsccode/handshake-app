/* eslint react/sort-comp:0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledButtonDropdown } from 'reactstrap';
import { buyCryptoGetCoinInfo, buyCryptoQuoteReverse } from '@/reducers/buyCoin/action';
import { API_URL, FIAT_CURRENCY } from '@/constants';
import debounce from '@/utils/debounce';
import { getErrorMessageFromCode } from '@/components/handshakes/exchange/utils';
import { formatMoney } from '@/services/offer-util';
import Cleave from 'cleave.js/react';
import { showAlert } from '@/reducers/app/action';
import { PAYMENT_METHODS } from '@/components/handshakes/exchange/Feed/BuyCryptoCoin';
import './styles.scss';

const isOverLimit = (data = {}) => {
  const amountInUsd = Number.parseFloat(data.amount);
  const limit = Number.parseFloat(data.limit);
  if (Number.isNaN(amountInUsd + limit)) {
    throw new TypeError('Amount & limit must be a number');
  }
  return amountInUsd > limit;
};

const EXCHANGE_TYPE = {
  AMOUNT_TO_MONEY: 'AMOUNT_TO_MONEY',
  MONEY_TO_AMOUNT: 'MONEY_TO_AMOUNT',
};

const FIAT_CURRENCY_SUPPORTED_LIST = {
  VND: FIAT_CURRENCY.VND,
  USD: FIAT_CURRENCY.USD,
  HKD: FIAT_CURRENCY.HKD,
};

const scopedCss = (className) => `coin-money-exchange-${className}`;

class CoinMoneyExchange extends Component {
  constructor(props) {
    super(props);
    this.state = {
      amount: 0,
      fiatAmount: 0,
      fiatAmountInUsd: 0,
    };

    this.onFiatAmountChange = ::this.onFiatAmountChange;
    this.onAmountChange = ::this.onAmountChange;
    this.getCoinInfo = debounce(::this.getCoinInfo, 300);
    this.isOverLimit = isOverLimit;
    this.getQuoteReverse = debounce(::this.getQuoteReverse, 300);
    this.renderFiatCurrencyList = ::this.renderFiatCurrencyList;
    this.onChangeCallbackHandler = debounce(::this.onChangeCallbackHandler, 1000);
    this.onGetCoinInfoError = ::this.onGetCoinInfoError;
    this.ongetQuoteReverseError = ::this.ongetQuoteReverseError;
    this.exchangeFiatAmount = ::this.exchangeFiatAmount;
    this.exchangeAmount = ::this.exchangeAmount;
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { amount, fiatAmount, exchangeType, fiatCurrency } = prevState;
    const { coinInfo, quoteReverse, currency, currencyByLocal, paymentMethod } = nextProps;
    const newState = { fiatCurrency: fiatCurrency || currencyByLocal };
    const isCurrencyChanged = currency !== prevState.currency;
    const isPaymentMethodChanged = paymentMethod !== prevState.paymentMethod;
    isCurrencyChanged && (newState.currency = currency);
    isPaymentMethodChanged && (newState.paymentMethod = paymentMethod);
    if (exchangeType === EXCHANGE_TYPE.AMOUNT_TO_MONEY) {
      newState.amount = amount;

      // clear fiat data if currency was changed, then will fetch new data
      if (isCurrencyChanged) {
        newState.fiatAmount = null;
        newState.fiatCurrency = null;
      } else if (!isCurrencyChanged) {
        // apply new exchange data to state
        if (coinInfo.fiatAmount && coinInfo.limit && isOverLimit({ amount: coinInfo.fiatAmount, limit: coinInfo.limit })) {
          newState.fiatAmount = coinInfo.fiatAmount;
          newState.fiatCurrency = coinInfo.fiatCurrency;
          if (paymentMethod === PAYMENT_METHODS.COD) {
            coinInfo.fiatAmountCod && (newState.fiatAmount = coinInfo.fiatAmountCod);
          }
        } else {
          newState.fiatAmount = coinInfo.fiatLocalAmount;
          newState.fiatCurrency = coinInfo.fiatLocalCurrency;
          if (paymentMethod === PAYMENT_METHODS.COD) {
            coinInfo.fiatLocalAmountCod && (newState.fiatAmount = coinInfo.fiatLocalAmountCod);
          }
        }
        newState.fiatAmountInUsd = coinInfo.fiatAmount;
      }
    } else if (exchangeType === EXCHANGE_TYPE.MONEY_TO_AMOUNT) {
      newState.fiatAmount = fiatAmount;
      newState.amount = quoteReverse.amount;
      newState.fiatAmountInUsd = quoteReverse.fiatAmount;

      if (isPaymentMethodChanged) {
        newState.amount = null;
      }
    }
    return newState;
  }

  shouldComponentUpdate() {
    return true;
  }

  componentDidUpdate() {
    const { fiatAmount, fiatCurrency, exchangeType, amount } = this.state;
    // re-fetch data when currency or fiatCurrency were changed
    if ((fiatAmount === null && fiatCurrency === null)) {
      if (exchangeType === EXCHANGE_TYPE.AMOUNT_TO_MONEY) {
        this.getCoinInfo();
      } else if (exchangeType === EXCHANGE_TYPE.MONEY_TO_AMOUNT) {
        this.getQuoteReverse();
      }
    }

    if (amount === null) {
      this.getQuoteReverse();
    }

    this.onChangeCallbackHandler();
  }

  onAmountChange(e) {
    this.exchangeAmount({ amount: e?.target?.value });
  }

  onFiatAmountChange(e) {
    const formatNumber = e?.target?.value?.replace(/[^0-9]/g, '');
    this.exchangeFiatAmount(Number.parseInt(formatNumber, 10));
  }

  exchangeAmount({ amount, fiatCurrency }) {
    this.setState({
      amount: amount || this.state.amount,
      exchangeType: EXCHANGE_TYPE.AMOUNT_TO_MONEY,
    }, this.getCoinInfo.call(this, { fiatCurrency }));
  }

  exchangeFiatAmount(fiatAmount) {
    this.setState({
      fiatAmount,
      exchangeType: EXCHANGE_TYPE.MONEY_TO_AMOUNT,
    }, this.getQuoteReverse);
  }

  onChangeCallbackHandler(data) {
    const { onChange } = this.props;
    const _data = {
      amount: this.state.amount,
      fiatAmount: this.state.fiatAmount,
      fiatCurrency: this.state.fiatCurrency,
      fiatAmountInUsd: this.state.fiatAmountInUsd,
      ...data,
    };
    if (typeof onChange === 'function') {
      onChange(_data);
    }
  }

  onGetCoinInfoError(e) {
    this.setState({ amount: 0 }, this.exchangeAmount.call(this, this.state.amount));
    this.props.showAlert({
      message: <div className="text-center">{getErrorMessageFromCode(e)}</div>,
      timeOut: 3000,
      type: 'danger',
    });
  }

  ongetQuoteReverseError(e) {
    this.setState({ fiatAmount: 0 }, this.exchangeFiatAmount.call(this, this.state.fiatAmount));
    this.props.showAlert({
      message: <div className="text-center">{getErrorMessageFromCode(e)}</div>,
      timeOut: 3000,
      type: 'danger',
    });
  }

  getQuoteReverse(data = {}) {
    const { fiatAmount, fiatCurrency, currency } = this.state;
    const { paymentMethod } = this.props;
    const _fiatCurrency = data.fiatCurrency || fiatCurrency;
    this.props.buyCryptoQuoteReverse({
      PATH_URL: `${API_URL.EXCHANGE.BUY_CRYPTO_QUOTE_REVERSE}?fiat_amount=${fiatAmount}&currency=${currency}&fiat_currency=${_fiatCurrency}&type=${paymentMethod}`,
      errorFn: this.ongetQuoteReverseError,
    });
  }

  getCoinInfo(data = {}) {
    const { amount, currency, fiatCurrency } = this.state;
    const { currencyByLocal } = this.props;
    const parsedAmount = Number.parseFloat(amount);
    const _fiatCurrency = data.fiatCurrency || fiatCurrency || currencyByLocal;
    if (parsedAmount >= 0 && currency && currencyByLocal) {
      this.props.buyCryptoGetCoinInfo({
        PATH_URL: `${API_URL.EXCHANGE.BUY_CRYPTO_GET_COIN_INFO}?amount=${parsedAmount}&currency=${currency}&fiat_currency=${_fiatCurrency}`,
        errorFn: this.onGetCoinInfoError,
      });
    }
  }

  onFiatCurrencyChange(fiatCurrency) {
    this.setState({ fiatCurrency }, () => this.exchangeAmount({ fiatCurrency }));
  }

  renderFiatCurrencyList() {
    return Object.entries(FIAT_CURRENCY_SUPPORTED_LIST).map(([key, value]) => (
      <DropdownItem key={key} value={value} onClick={() => this.onFiatCurrencyChange(value)}>
        {value}
      </DropdownItem>
    ));
  }

  render() {
    console.log('=== STATE', this.state);
    const { amount, fiatAmount, fiatCurrency } = this.state;
    const { coinInfo } = this.props;
    const overLimit = coinInfo.fiatAmount && coinInfo.limit && isOverLimit({ amount: coinInfo.fiatAmount || 0, limit: coinInfo.limit || 0 });
    return (
      <div className={scopedCss('container')}>
        <input
          value={amount}
          onChange={this.onAmountChange}
          className={`form-control ${scopedCss('amount-input')}`}
        />
        <Cleave
          className={`form-control ${scopedCss('fiat-amount-input')}`}
          placeholder="Fiat amount"
          value={formatMoney(fiatAmount)}
          options={{
            numeral: true,
            numeralThousandsGroupStyle: 'thousand',
          }}
          onChange={this.onFiatAmountChange}
        />
        <UncontrolledButtonDropdown className={scopedCss('fiat-amount-selector-container')}>
          <DropdownToggle className={scopedCss('fiat-amount-selector-btn')} color="light" block disabled={overLimit}>
            {fiatCurrency}
          </DropdownToggle>
          <DropdownMenu>
            {this.renderFiatCurrencyList()}
          </DropdownMenu>
        </UncontrolledButtonDropdown>
      </div>
    );
  }
}

CoinMoneyExchange.defaultProps = {
  currencyByLocal: 'USD',
  paymentMethod: 'bank',
  onChange: () => null,
};

CoinMoneyExchange.propTypes = {
  buyCryptoGetCoinInfo: PropTypes.func.isRequired,
  buyCryptoQuoteReverse: PropTypes.func.isRequired,
  currencyByLocal: PropTypes.string,
  currency: PropTypes.string.isRequired, // required later
  coinInfo: PropTypes.object.isRequired,
  quoteReverse: PropTypes.object.isRequired,
  paymentMethod: PropTypes.string, // required later
  onChange: PropTypes.func,
  showAlert: PropTypes.func.isRequired,
};

const mapState = (state) => {
  return {
    currencyByLocal: state.app.ipInfo.currency,
    coinInfo: state.buyCoin?.coinInfo || {},
    quoteReverse: state.buyCoin?.quoteReverse || {},
  };
};

export default connect(mapState, { buyCryptoGetCoinInfo, buyCryptoQuoteReverse, showAlert })(CoinMoneyExchange);
