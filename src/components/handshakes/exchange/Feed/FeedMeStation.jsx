import React from 'react';
import './FeedMe.scss';
import './FeedMeStation.scss';
import { FIAT_CURRENCY, URL } from '@/constants';
import { daysBetween, formatAmountCurrency, formatMoneyByLocale } from '@/services/offer-util';
import iconSpinner from '@/assets/images/icon/icons8-spinner.gif';
import iconAvatar from '@/assets/images/icon/avatar.svg';
import StarsRating from '@/components/core/presentation/StarsRating';
import CoinCards from '@/components/handshakes/exchange/components/CoinCards';
import { FormattedMessage, injectIntl } from 'react-intl';
import Modal from '@/components/core/controls/Modal';
import Button from '@/components/core/controls/Button';
import { connect } from 'react-redux';
import { showAlert } from '@/reducers/app/action';

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
      offerStores: this.props.offerStores,
      walletsData: false,
      inputRestoreWalletValue: '',
      intervalCountdown: null,
    };
  }

  componentDidMount() {

  }

  componentWillUnmount() {
    if (this.state.intervalCountdown) {
      clearInterval(this.state.intervalCountdown);
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.offerStores) {
      if (JSON.stringify(nextProps.offerStores) !== JSON.stringify(prevState.offerStores)) {
        return { offerStores: nextProps.offerStores };
      }
    }
    return null;
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

  render() {
    const { messages } = this.props.intl;
    const { statusText, nameShop, messageMovingCoin, dashboardInfo, } = this.props
    const { offerStores } = this.state;

    console.log('offerStores',offerStores);

    const review = offerStores?.review || 0;
    const reviewCount = offerStores?.reviewCount || 0;

    let transactionSuccessful = 0;
    let transactionFailed = 0;
    let transactionPending = 0;
    const transactionRevenue = [];

    if (dashboardInfo) {
      dashboardInfo.forEach((item) => {
        // console.log('item', item);
        transactionSuccessful += item.success;
        transactionFailed += item.failed;
        transactionPending += item.pending;

        Object.values(FIAT_CURRENCY).forEach((currency) => {
          const buy = item.buyFiatAmounts[currency];
          const sell = item.sellFiatAmounts[currency];

          if (buy || sell) {
            transactionRevenue.push(
            <div className="d-table w-100 station-info">
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

    console.log('thisss', this.props);
    return (
      <div>
        <div className="feed-me-station">
          <div className="d-table w-100">
            <div className="d-table-cell">
              <div className="status">{statusText}</div>
              <div className="status-explanation">{messageMovingCoin}</div>
            </div>
            { messageMovingCoin && (
              <div className="countdown d-table-cell text-right">
                <img src={iconSpinner} width="14px" />
                <span className="ml-1">{this.state.timePassing}</span>
              </div>)
            }
          </div>

          <CoinCards coins={[]} currency="ETH" />

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

const mapState = state => ({
  offerStores: state.exchange.offerStores,
  dashboardInfo: state.exchange.dashboardInfo,
});

const mapDispatch = ({
  showAlert,
});

export default injectIntl(connect(mapState, mapDispatch)(FeedMeStation));
