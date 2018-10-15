/* eslint react/sort-comp:0 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { DropdownItem, DropdownMenu, DropdownToggle, UncontrolledButtonDropdown } from 'reactstrap';
import { buyCryptoGetCoinInfo, buyCryptoQuoteReverse } from '@/reducers/buyCoin/action';
import { API_URL, FIAT_CURRENCY } from '@/constants';
import debounce from '@/utils/debounce';
// import { formatMoney } from '@/services/offer-util';
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
    };

    this.onFiatAmountChange = ::this.onFiatAmountChange;
    this.onAmountChange = ::this.onAmountChange;
    this.getCoinInfo = debounce(::this.getCoinInfo, 300);
    this.isOverLimit = isOverLimit;
    this.getQuoteReverse = debounce(::this.getQuoteReverse, 300);
    this.renderFiatCurrencyList = ::this.renderFiatCurrencyList;
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { amount, fiatAmount, exchangeType } = prevState;
    const { coinInfo, quoteReverse, currency, currencyByLocal } = nextProps;
    const newState = { fiatCurrency: currencyByLocal };
    const isCurrencyChanged = currency !== prevState.currency;

    isCurrencyChanged && (newState.currency = currency);
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
        } else {
          newState.fiatAmount = coinInfo.fiatLocalAmount;
          newState.fiatCurrency = coinInfo.fiatLocalCurrency;
        }
      }
    } else if (exchangeType === EXCHANGE_TYPE.MONEY_TO_AMOUNT) {
      newState.fiatAmount = fiatAmount;
      newState.amount = quoteReverse.amount;
    }
    return newState;
  }

  shouldComponentUpdate() {
    if (this.state.fiatCurrencyFromInput) {
      this.setState({ fiatCurrencyFromInput: null });
      return false;
    }
    return true;
  }

  componentDidUpdate() {
    const { fiatAmount, fiatCurrency, exchangeType, fiatCurrencyFromInput } = this.state;
    const data = {};
    // re-fetch data when currency or fiatCurrency were changed
    if ((!fiatAmount && !fiatCurrency) || fiatCurrencyFromInput) {
      fiatCurrencyFromInput && (data.fiatCurrency = fiatCurrencyFromInput);
      if (exchangeType === EXCHANGE_TYPE.AMOUNT_TO_MONEY) {
        this.getCoinInfo(data);
      } else if (exchangeType === EXCHANGE_TYPE.MONEY_TO_AMOUNT) {
        this.getQuoteReverse(data);
      }
    }
  }

  onAmountChange(e) {
    this.setState({
      amount: e?.target?.value,
      exchangeType: EXCHANGE_TYPE.AMOUNT_TO_MONEY,
    }, this.getCoinInfo);
  }

  onFiatAmountChange(e) {
    this.setState({
      fiatAmount: e?.target?.value,
      exchangeType: EXCHANGE_TYPE.MONEY_TO_AMOUNT,
    }, this.getQuoteReverse);
  }

  getQuoteReverse(data = {}) {
    const { fiatAmount, fiatCurrency, currency } = this.state;
    const { paymentMethod } = this.props;
    const _fiatCurrency = data.fiatCurrency || fiatCurrency;
    this.props.buyCryptoQuoteReverse({
      PATH_URL: `${API_URL.EXCHANGE.BUY_CRYPTO_QUOTE_REVERSE}?fiat_amount=${fiatAmount}&currency=${currency}&fiat_currency=${_fiatCurrency}&type=${paymentMethod}`,
    });
  }

  getCoinInfo(data = {}) {
    const { amount, currency } = this.state;
    const { currencyByLocal } = this.props;
    const parsedAmount = Number.parseFloat(amount) || null;
    const _fiatCurrency = data.fiatCurrency || currencyByLocal;
    if (parsedAmount && currency && currencyByLocal) {
      this.props.buyCryptoGetCoinInfo({
        PATH_URL: `${API_URL.EXCHANGE.BUY_CRYPTO_GET_COIN_INFO}?amount=${parsedAmount}&currency=${currency}&fiat_currency=${_fiatCurrency}`,
        errorFn: this.onGetCoinInfoError,
      });
    }
  }

  onFiatCurrencyChange(fiatCurrency) {
    this.setState({ fiatCurrencyFromInput: fiatCurrency });
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
    const overLimit = coinInfo.fiatAmount && coinInfo.limit && isOverLimit({ amount: coinInfo.fiatAmount || 0, limit: coinInfo.limit || 0});
    return (
      <div className={scopedCss('container')}>
        <input
          value={amount}
          onChange={this.onAmountChange}
          className={`form-control ${scopedCss('amount-input')}`}
        />
        <input
          value={fiatAmount}
          onChange={this.onFiatAmountChange}
          className={`form-control ${scopedCss('fiat-amount-input')}`}
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
  currency: 'ETH',
  paymentMethod: 'bank',
};

CoinMoneyExchange.propTypes = {
  buyCryptoGetCoinInfo: PropTypes.func.isRequired,
  buyCryptoQuoteReverse: PropTypes.func.isRequired,
  currencyByLocal: PropTypes.string,
  currency: PropTypes.string, // required later
  coinInfo: PropTypes.object.isRequired,
  quoteReverse: PropTypes.object.isRequired,
  paymentMethod: PropTypes.string, // required later
};

const mapState = (state) => {
  return {
    currencyByLocal: state.app.ipInfo.currency,
    coinInfo: state.buyCoin?.coinInfo || {},
    quoteReverse: state.buyCoin?.quoteReverse || {},
  };
};

export default connect(mapState, { buyCryptoGetCoinInfo, buyCryptoQuoteReverse })(CoinMoneyExchange);
