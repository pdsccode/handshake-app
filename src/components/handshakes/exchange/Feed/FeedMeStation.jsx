import React from 'react';
import './FeedMe.scss';
import './FeedMeStation.scss';
import { CRYPTO_CURRENCY, EXCHANGE_ACTION, FIAT_CURRENCY, URL } from '@/constants';
import { daysBetween, formatAmountCurrency, formatMoneyByLocale, getOfferPrice } from '@/services/offer-util';
import iconSpinner from '@/assets/images/icon/icons8-spinner.gif';
import iconAvatar from '@/assets/images/icon/avatar.svg';
import StarsRating from '@/components/core/presentation/StarsRating';
import CoinCards from '@/components/handshakes/exchange/components/CoinCards';
import { FormattedMessage, injectIntl } from 'react-intl';
import Modal from '@/components/core/controls/Modal';
import Button from '@/components/core/controls/Button';
import { connect } from 'react-redux';
import { showAlert } from '@/reducers/app/action';

import iconBtc from '@/assets/images/icon/coin/icon-btc.svg';
import iconEth from '@/assets/images/icon/coin/icon-eth.svg';
import { HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS, HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS_VALUE } from '@/constants';

window.Clipboard = (function (window, document, navigator) {
  let textArea,
    copy; function isOS() { return navigator.userAgent.match(/ipad|iphone/i); } function createTextArea(text) { textArea = document.createElement('textArea'); textArea.value = text; document.body.appendChild(textArea); } function selectText() {
    let range,
      selection; if (isOS()) { range = document.createRange(); range.selectNodeContents(textArea); selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range); textArea.setSelectionRange(0, 999999); } else { textArea.select(); }
  } function copyToClipboard() { document.execCommand('copy'); document.body.removeChild(textArea); } copy = function (text) { createTextArea(text); selectText(); copyToClipboard(); }; return { copy };
}(window, document, navigator));

class FeedMeStation extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      timePassing: '',
      walletsData: false,
      inputRestoreWalletValue: '',
      coins: [],
      isShowTimer: false,
    };
  }

  componentDidMount() {
    const { messageMovingCoin, offer } = this.props;

    this.getCoinList();

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

  handleFocus = (e) => {
    e.currentTarget.select();
  }

  showToast(mst) {
    this.showAlert(mst, 'primary', 2000);
  }

  updateRestoreWalletValue = (evt) => {
    this.setState({
      inputRestoreWalletValue: evt.target.value,
    });
  }

  getPrices = () => {
    const { offer, listOfferPrice, fiatCurrency } = this.props;

    let priceBuyBTC;
    let priceSellBTC;
    let priceBuyETH;
    let priceSellETH;

    const eth = offer.items.ETH;
    const btc = offer.items.BTC;

    if (listOfferPrice) {
      let offerPrice = getOfferPrice(listOfferPrice, EXCHANGE_ACTION.BUY, CRYPTO_CURRENCY.BTC, fiatCurrency);
      priceBuyBTC = offerPrice.price * (1 + btc?.buyPercentage / 100) || 0;

      offerPrice = getOfferPrice(listOfferPrice, EXCHANGE_ACTION.SELL, CRYPTO_CURRENCY.BTC, fiatCurrency);
      priceSellBTC = offerPrice.price * (1 + btc?.sellPercentage / 100) || 0;

      offerPrice = getOfferPrice(listOfferPrice, EXCHANGE_ACTION.BUY, CRYPTO_CURRENCY.ETH, fiatCurrency);
      priceBuyETH = offerPrice.price * (1 + eth?.buyPercentage / 100) || 0;

      offerPrice = getOfferPrice(listOfferPrice, EXCHANGE_ACTION.SELL, CRYPTO_CURRENCY.ETH, fiatCurrency);
      priceSellETH = offerPrice.price * (1 + eth?.sellPercentage / 100) || 0;
    }

    return {
      priceBuyBTC, priceSellBTC, priceBuyETH, priceSellETH,
    };
  }

  isEmptyBalance = (item) => {
    const { buyBalance, sellBalance } = item;
    return !(buyBalance > 0 || sellBalance > 0);
  }

  getCoinList = () => {
    const { offer, fiatCurrency: currency } = this.props;
    const coins = [];
    const {
      priceBuyBTC, priceSellBTC, priceBuyETH, priceSellETH,
    } = this.getPrices();

    if (offer.itemFlags.ETH) {
      const eth = offer.items.ETH;
      if (!this.isEmptyBalance(eth)) {
        const coin = {};

        coin.name = CRYPTO_CURRENCY.ETH;
        coin.color = 'linear-gradient(-135deg, #D772FF 0%, #9B10F2 45%, #9E53E1 100%)';
        coin.icon = iconEth;
        const priceBuy = eth.buyBalance > 0 ? formatMoneyByLocale(priceBuyETH, currency) : '-';
        const priceSell = eth.sellBalance > 0 ? formatMoneyByLocale(priceSellETH, currency) : '-';
        coin.txtBuy = `${priceBuy} ${priceBuy !== '-' ? currency : ''} ${priceBuy !== '-' ? `- ${formatAmountCurrency(eth.buyBalance)} ${CRYPTO_CURRENCY.ETH}` : ''}`;
        coin.txtSell = `${priceSell} ${priceSell !== '-' ? currency : ''} ${priceSell !== '-' ? `- ${formatAmountCurrency(eth.sellBalance)} ${CRYPTO_CURRENCY.ETH}` : ''}`;

        const status = HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS_VALUE[eth.status];
        if (status === HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS.ACTIVE) {
          coin.onClose = this.deleteOfferItem;
        }

        coins.push(coin);
      }
    }

    if (offer.itemFlags.BTC) {
      const btc = offer.items.BTC;
      if (!this.isEmptyBalance(btc)) {
        const coin = {};

        coin.name = CRYPTO_CURRENCY.BTC;
        coin.color = 'linear-gradient(45deg, #FF8006 0%, #FFA733 51%, #FFC349 100%)';
        coin.icon = iconBtc;
        const priceBuy = btc.buyBalance > 0 ? formatMoneyByLocale(priceBuyBTC, currency) : '-';
        const priceSell = btc.sellBalance > 0 ? formatMoneyByLocale(priceSellBTC, currency) : '-';
        coin.txtBuy = `${priceBuy} ${priceBuy !== '-' ? currency : ''} ${priceBuy !== '-' ? `- ${formatAmountCurrency(btc.buyBalance)} ${CRYPTO_CURRENCY.BTC}` : ''}`;
        coin.txtSell = `${priceSell} ${priceSell !== '-' ? currency : ''} ${priceSell !== '-' ? `- ${formatAmountCurrency(btc.sellBalance)} ${CRYPTO_CURRENCY.BTC}` : ''}`;

        const status = HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS_VALUE[btc.status];
        if (status === HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS.ACTIVE) {
          coin.onClose = this.deleteOfferItem;
        }

        coins.push(coin);
      }
    }

    this.setState({ coins });
  }

  deleteOfferItem = (currency) => {
    const { offer, deleteOfferItem } = this.props;

    for (const item of Object.values(offer.items)) {
      if (item.currency === currency) {
        deleteOfferItem(item);
        break;
      }
    }
  }

  render() {
    const { messages } = this.props.intl;
    const {
      statusText, nameShop, messageMovingCoin,
      review, reviewCount, fiatCurrency,
      transactionSuccessful,
      transactionFailed,
      transactionPending,
      transactionRevenue,
      transactionTotal,
    } = this.props;
    const { coins, isShowTimer } = this.state;

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

          <div className="d-table w-100 mt-2">
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
          <div className="d-table w-100 station-info">
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
        <button className="btn btn-primary btn-block">Backup</button>
        {/* Modal for Backup wallets : */}
        <Modal title={messages.wallet.action.backup.header} onRef={modal => this.modalBackupRef = modal}>
          <div className="bodyTitle">{messages.wallet.action.backup.description}</div>
          <div className="bodyBackup">
            <textarea
              readOnly
              onClick={this.handleChange}
              onFocus={this.handleFocus}
              value={this.state.walletsData ? JSON.stringify(this.state.walletsData) : ''}
            />
            <Button className="button" cssType="danger" onClick={() => { Clipboard.copy(JSON.stringify(this.state.walletsData)); this.modalBackupRef.close(); this.showToast(messages.wallet.action.backup.success.copied); }} >{messages.wallet.action.backup.button.copy}</Button>
          </div>
        </Modal>

        {/* Modal for Restore wallets : */}
        <Modal title={messages.wallet.action.restore.header} onRef={modal => this.modalRestoreRef = modal}>
          <div className="bodyTitle">{messages.wallet.action.restore.description}</div>
          <div className="bodyBackup">
            <textarea
              required
              value={this.state.inputRestoreWalletValue}
              className={this.state.erroValueBackup ? 'error' : ''}
              onChange={evt => this.updateRestoreWalletValue(evt)}
            />
            <Button isLoading={this.state.isRestoreLoading} className="button" cssType="danger" onClick={() => { this.restoreWallets(); }} >
              {messages.wallet.action.restore.button.restore}
            </Button>
          </div>
        </Modal>
      </div>
    );
  }
}

const mapState = (state) => {
  const dashboardInfo = state.exchange.dashboardInfo;
  const listOfferPrice = state.exchange.listOfferPrice;

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
          transactionRevenue.push(<div className="d-table w-100 station-info">
            <div className="d-table-cell align-middle label"><FormattedMessage id="ex.shop.dashboard.label.revenue" /> {item.currency}</div>
            <div className="d-table-cell align-middle text-right info">{formatMoneyByLocale(buy?.amount || 0, currency)}/{formatMoneyByLocale(sell?.amount || 0, currency)} {currency}</div>
                                  </div>);
        }
      });
    });
  }

  const transactionTotal = dashboardInfo && dashboardInfo.map(item => (
    <div className="d-table w-100 station-info">
      <div className="d-table-cell align-middle label"><FormattedMessage id="ex.shop.dashboard.label.transaction.total" /> {item.currency}</div>
      <div className="d-table-cell align-middle text-right info">{formatAmountCurrency(item.buyAmount)}/{formatAmountCurrency(item.sellAmount)}</div>
    </div>));

  return {
    dashboardInfo,
    listOfferPrice,
    transactionSuccessful,
    transactionFailed,
    transactionPending,
    transactionRevenue,
    transactionTotal,
  };
};

const mapDispatch = ({
  showAlert,
});

export default injectIntl(connect(mapState, mapDispatch)(FeedMeStation));
