/* eslint react/sort-comp:0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledButtonDropdown } from 'reactstrap';
import { buyCryptoGetCoinInfo, buyCryptoQuoteReverse } from '@/reducers/buyCoin/action';
import { API_URL, FIAT_CURRENCY } from '@/constants';
import debounce from '@/utils/debounce';
import { getErrorMessageFromCode } from '@/components/handshakes/exchange/utils';
import Cleave from 'cleave.js/react';
import { showAlert } from '@/reducers/app/action';
import { PAYMENT_METHODS } from '@/components/handshakes/exchange/Feed/BuyCryptoCoin';
import { isOverLimit } from '@/reducers/buyCoin/index';
import './styles.scss';
import * as gtag from '@/services/ga-utils';
import taggingConfig from '@/services/tagging-config';

const formatMoney = (money = 0, currency = FIAT_CURRENCY.USD) => {
  if (currency === FIAT_CURRENCY.VND) {
    return Math.round(money);
  }
  return Number.parseFloat(money).toFixed(2);
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
      isExchanging: false,
    };

    this.onFiatAmountChange = ::this.onFiatAmountChange;
    this.onAmountChange = ::this.onAmountChange;
    this.getCoinInfo = debounce(::this.getCoinInfo, 1000);
    this.isOverLimit = isOverLimit;
    this.getQuoteReverse = debounce(::this.getQuoteReverse, 1000);
    this.renderFiatCurrencyList = ::this.renderFiatCurrencyList;
    this.onChangeCallbackHandler = debounce(::this.onChangeCallbackHandler, 100);
    this.onGetCoinInfoError = ::this.onGetCoinInfoError;
    this.ongetQuoteReverseError = ::this.ongetQuoteReverseError;
    this.exchangeFiatAmount = ::this.exchangeFiatAmount;
    this.exchangeAmount = ::this.exchangeAmount;
    this.showLoading = :: this.showLoading;
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
          newState.fiatAmount = formatMoney(coinInfo.fiatAmount, coinInfo.fiatCurrency);
          newState.fiatCurrency = coinInfo.fiatCurrency;
          if (paymentMethod === PAYMENT_METHODS.COD) {
            coinInfo.fiatAmountCod && (newState.fiatAmount = formatMoney(coinInfo.fiatAmountCod, coinInfo.fiatCurrency));
          }
        } else {
          newState.fiatAmount = formatMoney(coinInfo.fiatLocalAmount, coinInfo.fiatLocalCurrency);
          newState.fiatCurrency = coinInfo.fiatLocalCurrency;
          if (paymentMethod === PAYMENT_METHODS.COD) {
            coinInfo.fiatLocalAmountCod && (newState.fiatAmount = formatMoney(coinInfo.fiatLocalAmountCod, coinInfo.fiatLocalCurrency));
          }
        }
        newState.fiatAmountInUsd = formatMoney(coinInfo.fiatAmount, FIAT_CURRENCY.USD);
      }
    } else if (exchangeType === EXCHANGE_TYPE.MONEY_TO_AMOUNT) {
      newState.fiatAmount = fiatAmount;
      newState.amount = quoteReverse.amount;
      newState.fiatAmountInUsd = formatMoney(quoteReverse.fiatAmount, FIAT_CURRENCY.USD);

      if (isPaymentMethodChanged) {
        newState.amount = null;
      }
    }
    return newState;
  }

  componentDidCatch(e) {
    console.warn(e);
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

  showLoading(isShow = true) {
    this.setState({ isExchanging: isShow });
  }

  onAmountChange(e) {
    this.showLoading();
    this.exchangeAmount({ amount: e?.target?.value?.replace(/,/g, '') || 0 });
  }

  onFiatAmountChange(e) {
    this.showLoading();
    const formatNumber = e?.target?.value?.replace(/,/g, '') || 0;
    this.exchangeFiatAmount(Number.parseFloat(formatNumber));
  }

  exchangeAmount({ amount, fiatCurrency }) {
    this.setState({
      amount,
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
    const { onChange, coinInfo } = this.props;
    const _data = {
      amount: Number.parseFloat(this.state.amount) || 0,
      fiatAmount: Number.parseFloat(this.state.fiatAmount),
      fiatCurrency: this.state.fiatCurrency,
      fiatAmountInUsd: Number.parseFloat(this.state.fiatAmountInUsd),
      isOverLimit: isOverLimit({ amount: this.state.fiatAmountInUsd || 0, limit: coinInfo?.limit || 0 }),
      ...data,
    };
    if (typeof onChange === 'function') {
      onChange(_data);
    }
  }

  onGetCoinInfoError(e) {
    this.showLoading(false);
    this.setState({ amount: 0 }, this.exchangeAmount.call(this, { amount: this.state.amount }));
    this.props.showAlert({
      message: <div className="text-center">{getErrorMessageFromCode(e)}</div>,
      timeOut: 3000,
      type: 'danger',
    });
  }

  ongetQuoteReverseError(e) {
    this.showLoading(false);
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
    const _fiatAmount = Number.parseFloat(data.fiatAmount ? data.fiatAmount : fiatAmount) || 0;
    if (_fiatAmount >= 0 && _fiatCurrency && currency && paymentMethod) {
      this.showLoading();
      gtag.event({
        category: taggingConfig.coin.category,
        action: taggingConfig.coin.action.getReverseCoinInfo,
      });
      this.props.buyCryptoQuoteReverse({
        PATH_URL: `${API_URL.EXCHANGE.BUY_CRYPTO_QUOTE_REVERSE}?fiat_amount=${_fiatAmount}&currency=${currency}&fiat_currency=${_fiatCurrency}&type=${paymentMethod}`,
        errorFn: this.ongetQuoteReverseError,
        successFn: () => { this.showLoading(false); },
      });
    }
  }

  getCoinInfo(data = {}) {
    const { amount, currency, fiatCurrency } = this.state;
    const { currencyByLocal } = this.props;
    const parsedAmount = Number.parseFloat(amount) || 0;
    const _fiatCurrency = data.fiatCurrency || fiatCurrency || currencyByLocal;
    if (parsedAmount >= 0 && currency && currencyByLocal) {
      this.showLoading();
      gtag.event({
        category: taggingConfig.coin.category,
        action: taggingConfig.coin.action.getCoinInfo,
      });
      this.props.buyCryptoGetCoinInfo({
        PATH_URL: `${API_URL.EXCHANGE.BUY_CRYPTO_GET_COIN_INFO}?amount=${parsedAmount}&currency=${currency}&fiat_currency=${_fiatCurrency}`,
        errorFn: this.onGetCoinInfoError,
        successFn: () => { this.showLoading(false); },
      });
    }
  }

  onFiatCurrencyChange(fiatCurrency) {
    this.setState({ fiatCurrency }, () => this.exchangeAmount({ amount: this.state.amount, fiatCurrency }));
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
    const { amount, fiatAmount, fiatCurrency, isExchanging } = this.state;
    const { fiatAmountOverLimit, onFocus, onBlur, markRequired } = this.props;
    return (
      <div className={`${scopedCss('container')} ${markRequired ? 'error' : ''}`} onFocus={() => onFocus()} onBlur={() => onBlur()}>
        <Cleave
          className={`form-control ${scopedCss('amount-input')}`}
          value={amount || ''}
          options={{
            numeral: true,
            numeralDecimalScale: 4,
            numeralThousandsGroupStyle: 'thousand',
          }}
          placeholder="0.0"
          onChange={this.onAmountChange}
        />
        <Cleave
          className={`form-control ${scopedCss('fiat-amount-input')}`}
          value={fiatAmount || ''}
          options={{
            numeral: true,
            numeralThousandsGroupStyle: 'thousand',
          }}
          placeholder="0.0"
          onChange={this.onFiatAmountChange}
        />
        <UncontrolledButtonDropdown className={scopedCss('fiat-amount-selector-container')}>
          <DropdownToggle className={scopedCss('fiat-amount-selector-btn')} color="light" block disabled={fiatAmountOverLimit}>
            {fiatCurrency}
          </DropdownToggle>
          <DropdownMenu>
            {this.renderFiatCurrencyList()}
          </DropdownMenu>
        </UncontrolledButtonDropdown>
        <hr className={isExchanging ? 'loading-bar' : ''} />
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
  currency: PropTypes.string.isRequired,
  coinInfo: PropTypes.object.isRequired,
  quoteReverse: PropTypes.object.isRequired,
  paymentMethod: PropTypes.string,
  onChange: PropTypes.func,
  showAlert: PropTypes.func.isRequired,
  fiatAmountOverLimit: PropTypes.bool.isRequired,
  onFocus: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
  markRequired: PropTypes.bool.isRequired,
};

const mapState = (state) => {
  return {
    currencyByLocal: state.app.ipInfo.currency,
    coinInfo: state.buyCoin?.coinInfo || {},
    quoteReverse: state.buyCoin?.quoteReverse || {},
    fiatAmountOverLimit: state.buyCoin?.fiatAmountOverLimit,
  };
};

export default connect(mapState, { buyCryptoGetCoinInfo, buyCryptoQuoteReverse, showAlert })(CoinMoneyExchange);
