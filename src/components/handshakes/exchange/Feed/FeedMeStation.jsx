import React from 'react';
import './FeedMe.scss';
import './FeedMeStation.scss';
import {
  FIAT_CURRENCY,
  HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS,
  HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS_VALUE,
} from '@/constants';
import { daysBetween, formatAmountCurrency, formatMoneyByLocale } from '@/services/offer-util';
import iconSpinner from '@/assets/images/icon/icons8-spinner.gif';
import iconAvatar from '@/assets/images/icon/avatar.svg';
import StarsRating from '@/components/core/presentation/StarsRating';
import CoinCards from '@/components/handshakes/exchange/components/CoinCards';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';

class FeedMeStation extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      timePassing: '',
      isShowTimer: false,
    };
  }

  componentDidMount() {
    const { messageMovingCoin, offer } = this.props;

    const eth = offer.items.ETH;
    const btc = offer.items.BTC;

    let isShowTimer = false;
    let lastUpdateAt = '';

    if (eth) {
      const status = HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS_VALUE[eth.status];
      isShowTimer = status === HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS.CREATED || status === HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS.CLOSING;

      if (isShowTimer) {
        lastUpdateAt = eth.updatedAt;
      }
    }

    if (btc) {
      if (!isShowTimer) {
        const status = HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS_VALUE[btc.status];
        isShowTimer = status === HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS.CREATED || status === HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS.CLOSING;

        if (isShowTimer) {
          lastUpdateAt = eth.updatedAt;
        }
      }
    }

    this.setState({ isShowTimer });

    if (messageMovingCoin && isShowTimer) {
      this.intervalCountdown = setInterval(() => {
        this.setState({ timePassing: daysBetween(new Date(lastUpdateAt * 1000), new Date()) });
      }, 1000);
    }
  }

  componentWillUnmount() {
    if (this.intervalCountdown) {
      clearInterval(this.intervalCountdown);
    }
  }

  render() {
    const {
      statusText, nameShop, messageMovingCoin,
      review, reviewCount, fiatCurrency,
      transactionSuccessful,
      transactionFailed,
      transactionPending,
      transactionRevenue,
      transactionTotal,
      coins,
    } = this.props;
    const { isShowTimer } = this.state;

    // console.log('thisss', this.props);
    return (
      <div>
        <div className="feed-me-station">
          <div className="d-table w-100">
            <div className="d-table-cell">
              <div className="status">{statusText}</div>
              <div className="status-explanation">{messageMovingCoin}</div>
            </div>
            { messageMovingCoin && isShowTimer && (
              <div className="countdown d-table-cell text-right">
                <img src={iconSpinner} width="14px" />
                <span className="ml-1">{this.state.timePassing}</span>
              </div>)
            }
          </div>

          <CoinCards coins={coins} currency={fiatCurrency} />

          <div className="mt-3 d-table w-100">
            <div className="d-table-cell align-middle" style={{ width: '42px' }}>
              <img src={iconAvatar} width="35px" alt="" />
            </div>
            <div className="d-table-cell align-middle address-info">
              <div>{nameShop}</div>
              <div>
                <StarsRating className="d-inline-block" starPoint={review} startNum={5} />
                <span className="ml-2"><FormattedMessage id="ex.shop.shake.label.reviews.count" values={{ reviewCount }} /></span>
              </div>
            </div>
          </div>

          <div className="mt-3 d-table w-100 station-info">
            <div className="d-table-cell align-middle label"><FormattedMessage id="ex.shop.dashboard.label.transaction.successfull.failed" /></div>
            <div className="d-table-cell align-middle text-right info">{`${transactionSuccessful}/${transactionFailed}`}</div>
          </div>
          <div className="mt-3 d-table w-100 station-info">
            <div className="d-table-cell align-middle label"><FormattedMessage id="ex.shop.dashboard.label.transaction.pending" /></div>
            <div className="d-table-cell align-middle text-right info">{transactionPending}</div>
          </div>

          {
            transactionRevenue && transactionRevenue
          }
          {
            transactionTotal && transactionTotal
          }

        </div>
      </div>
    );
  }
}

const mapState = (state) => {
  const dashboardInfo = state.exchange.dashboardInfo;

  let transactionSuccessful = 0;
  let transactionFailed = 0;
  let transactionPending = 0;
  const transactionRevenue = [];

  if (dashboardInfo) {
    dashboardInfo.forEach((item) => {
      transactionSuccessful += item.success;
      transactionFailed += item.failed;
      transactionPending += item.pending;

      Object.values(FIAT_CURRENCY).forEach((currency) => {
        const buy = item.buyFiatAmounts[currency];
        const sell = item.sellFiatAmounts[currency];

        if (buy || sell) {
          transactionRevenue.push(<div className="mt-3 d-table w-100 station-info">
            <div className="d-table-cell align-middle label"><FormattedMessage id="ex.shop.dashboard.label.revenue" /> {item.currency}</div>
            <div className="d-table-cell align-middle text-right info">{formatMoneyByLocale(buy?.amount || 0, currency)}/{formatMoneyByLocale(sell?.amount || 0, currency)} {currency}</div>
                                  </div>);
        }
      });
    });
  }

  const transactionTotal = dashboardInfo && dashboardInfo.map(item => (
    <div className="mt-3 d-table w-100 station-info">
      <div className="d-table-cell align-middle label"><FormattedMessage id="ex.shop.dashboard.label.transaction.total" /> {item.currency}</div>
      <div className="d-table-cell align-middle text-right info">{formatAmountCurrency(item.buyAmount)}/{formatAmountCurrency(item.sellAmount)}</div>
    </div>));

  return {
    dashboardInfo,
    transactionSuccessful,
    transactionFailed,
    transactionPending,
    transactionRevenue,
    transactionTotal,
  };
};

const mapDispatch = ({
});

export default injectIntl(connect(mapState, mapDispatch)(FeedMeStation));
