import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
// action, mock
import { fireBaseBettingChange, fireBaseExchangeDataChange, loadMyHandshakeList } from '@/reducers/me/action';
import {
  API_URL,
  APP,
  CRYPTO_CURRENCY,
  CRYPTO_CURRENCY_NAME,
  EXCHANGE_ACTION,
  EXCHANGE_FEED_TYPE,
  FIAT_CURRENCY,
  HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS,
  HANDSHAKE_ID,
  HANDSHAKE_ID_DEFAULT,
  URL,
} from '@/constants';
import { fieldDropdown, fieldRadioButton } from '@/components/core/form/customField';
import { FormattedMessage, injectIntl } from 'react-intl';
// components
import {
  deactiveDepositCoinATM,
  getDashboardInfo,
  getListOfferPrice,
  getOfferStores,
  reviewOffer,
} from '@/reducers/exchange/action';
// style
import { setOfflineStatus } from '@/reducers/auth/action';
import { change } from 'redux-form';
import cx from 'classnames';

import iconBitcoin from '@/assets/images/icon/coin/btc.svg';
import iconEthereum from '@/assets/images/icon/coin/eth.svg';
import iconBitcoinCash from '@/assets/images/icon/coin/bch.svg';
import { formatMoneyByLocale } from '@/services/offer-util';
import iconSpinner from '@/assets/images/icon/icons8-spinner.gif';

export const CRYPTO_ICONS = {
  [CRYPTO_CURRENCY.ETH]: iconEthereum,
  [CRYPTO_CURRENCY.BTC]: iconBitcoin,
  BCH: iconBitcoinCash,
};

class Asset extends React.Component {
  showLoading = () => {
    this.props.setLoading(true);
  }

  hideLoading = () => {
    this.props.setLoading(false);
  }

  depositCoinATM = () => {
    const { currency } = this.props;
    this.props.history.push(`${URL.ESCROW_DEPOSIT}?currency=${currency}`);
  }

  deactiveDeposit = () => {
    console.log('deactiveDeposit');
    this.showLoading();
    const offer = {};

    this.props.withdrawCashDepositATM({
      PATH_URL: API_URL.EXCHANGE.WITHDRAW_CASH_DEPOSIT_ATM,
      data: offer,
      METHOD: 'POST',
      successFn: this.handleWithdrawCashSuccess,
      errorFn: this.handleWithdrawCashFailed,
    });
  }

  handleWithdrawCashSuccess = async (res) => {
    console.log('handleWithdrawCashSuccess', res);

    this.hideLoading();

    this.props.history.push(URL.ESCROW_WITHDRAW_SUCCESS);
  }

  handleWithdrawCashFailed = (e) => {
    console.log('handleWithdrawCashFailed', e);
    this.hideLoading();

    this.props.showAlert({
      message: <div className="text-center">{getErrorMessageFromCode(e)}</div>,
      timeOut: 3000,
      type: 'danger',
    });
  }

  render() {
    const { messages } = this.props.intl;
    const { currency, status, subStatus, sold, balance, revenue, percentage, listOfferPrice } = this.props;
    // const isActive = status === 'active';

    const offerPrice = listOfferPrice && listOfferPrice.find((item) => {
      const { type, currency: name, fiatCurrency } = item;
      return type === EXCHANGE_ACTION.SELL && currency === name && fiatCurrency === FIAT_CURRENCY.USD;
    });

    let fiatCurrency = offerPrice && offerPrice.price || 0;
    fiatCurrency *= (1 + percentage / 100);

    return (
      <div className="asset position-relative">
        <div style={{ opacity: status === 'inactive' ? 0.3 : 1 }}>
          <div>
            <img src={CRYPTO_ICONS[currency]} width={19} />
            <span className="ml-1 text-normal">{CRYPTO_CURRENCY_NAME[currency]}</span>
          </div>
          <div className="mt-4">
            <div className="d-table w-100 mt-2">
              <div className="d-table-cell text-normal">
                <FormattedMessage id="dashboard.label.amountSold" />
              </div>
              <div className="d-table-cell text-right red-color">
                {sold || 0}
              </div>
            </div>
            <div className="d-table w-100 mt-2">
              <div className="d-table-cell text-normal">
                <FormattedMessage id="dashboard.label.amountLeft" />
              </div>
              <div className="d-table-cell text-right black-color">
                {balance || 0}
              </div>
            </div>
            <div className="d-table w-100 mt-2">
              <div className="d-table-cell text-normal">
                <FormattedMessage id="dashboard.label.currentPrice" values={{ currency, fiatCurrency: FIAT_CURRENCY.USD }} />
              </div>
              <div className="d-table-cell text-right black-color">
                {formatMoneyByLocale(fiatCurrency, FIAT_CURRENCY.USD)}
              </div>
            </div>
            <div className="d-table w-100 mt-2">
              <div className="d-table-cell text-normal">
                <FormattedMessage id="dashboard.label.revenue" />
              </div>
              <div className="d-table-cell text-right black-color">
                ${revenue || 0}
              </div>
            </div>
          </div>
        </div>

        {
          status === 'inactive' ? (
            <button
              className={cx('btn btn-sm btn-activate', 'primary-button')}
              onClick={this.depositCoinATM}
            >
              <FormattedMessage id="dashboard.btn.reactivate" />
            </button>
          ) : subStatus !== 'transferring' ? (
            <button
              className={cx('btn btn-sm btn-activate', 'outline-button')}
              onClick={this.deactiveDeposit}
            >
              <FormattedMessage id="dashboard.btn.deactivate" />
            </button>
          ) : (
            <div className="d-table-cell text-right"
            >
              <img src={iconSpinner} width="14px" style={{ marginTop: '-2px' }} />
              <span className="ml-1"><FormattedMessage id="dashboard.btn.depositing" /></span>
            </div>
          )
        }

        <hr />
      </div>
    );
  }
}

const mapState = state => ({
  // me: state.me
  listOfferPrice: state.exchange.listOfferPrice,
});

const mapDispatch = dispatch => ({
  rfChange: bindActionCreators(change, dispatch),
  deactiveDepositCoinATM: bindActionCreators(deactiveDepositCoinATM, dispatch),
});

export default injectIntl(connect(mapState, mapDispatch)(Asset));
