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
import { getDashboardInfo, getListOfferPrice, getOfferStores, reviewOffer } from '@/reducers/exchange/action';
// style
import { setOfflineStatus } from '@/reducers/auth/action';
import { change } from 'redux-form';
import cx from 'classnames';

import iconBitcoin from '@/assets/images/icon/coin/btc.svg';
import iconEthereum from '@/assets/images/icon/coin/eth.svg';
import iconBitcoinCash from '@/assets/images/icon/coin/bch.svg';
import { formatMoneyByLocale } from '@/services/offer-util';

export const CRYPTO_ICONS = {
  [CRYPTO_CURRENCY.ETH]: iconEthereum,
  [CRYPTO_CURRENCY.BTC]: iconBitcoin,
  BCH: iconBitcoinCash,
};

class Asset extends React.Component {
  render() {
    const { messages } = this.props.intl;
    const { currency, status, sold, balance, revenue, percentage, listOfferPrice } = this.props;
    const isActive = status === 'active';

    const offerPrice = listOfferPrice && listOfferPrice.find((item) => {
      const { type, currency: name, fiatCurrency } = item;
      return type === EXCHANGE_ACTION.SELL && currency === name && fiatCurrency === FIAT_CURRENCY.USD;
    });

    let fiatCurrency = offerPrice && offerPrice.price || 0;
    fiatCurrency *= (1 + percentage / 100);

    return (
      <div className="position-relative">
        <div style={{ opacity: isActive ? 1 : 0.3 }}>
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
                <FormattedMessage id="dashboard.label.currentPrice" />
              </div>
              <div className="d-table-cell text-right black-color">
                ${formatMoneyByLocale(fiatCurrency, FIAT_CURRENCY.USD)}
              </div>
            </div>
            <div className="d-table w-100 mt-2">
              <div className="d-table-cell text-normal">
                <FormattedMessage id="dashboard.label.revenue" />
              </div>
              <div className="d-table-cell text-right black-color">
                ${formatMoneyByLocale(revenue || 0)}
              </div>
            </div>
          </div>
        </div>


        <button
          className={cx('btn btn-sm btn-activate', isActive ? 'outline-button' : 'primary-button')}
        >
          {
            isActive ? <FormattedMessage id="dashboard.btn.deactivate" /> : <FormattedMessage id="dashboard.btn.reactivate" />
          }
        </button>
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
});

export default injectIntl(connect(mapState, mapDispatch)(Asset));
