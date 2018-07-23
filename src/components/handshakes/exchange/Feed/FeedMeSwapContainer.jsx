import React from "react";
import FeedMeCash from './FeedMeCash';
import {
  API_URL,
  CRYPTO_CURRENCY,
  EXCHANGE_ACTION,
  EXCHANGE_ACTION_PAST_NAME,
  EXCHANGE_ACTION_PRESENT_NAME,
  HANDSHAKE_EXCHANGE_STATUS,
  HANDSHAKE_EXCHANGE_STATUS_NAME,
  HANDSHAKE_USER
} from "@/constants";
import {MasterWallet} from '@/services/Wallets/MasterWallet';
import {ExchangeHandshake} from "@/services/neuron";
import {FormattedMessage} from "react-intl";
import {connect} from "react-redux";
import PropTypes from "prop-types";
import {hideLoading, showAlert, showLoading} from '@/reducers/app/action';
import Button from '@/components/core/controls/Button/Button';
import {responseExchangeDataChange} from "@/reducers/me/action";
import {Ethereum} from '@/services/Wallets/Ethereum.js';
import {Bitcoin} from '@/services/Wallets/Bitcoin';
import {formatAmountCurrency, getHandshakeUserType, } from "@/services/offer-util";
import Offer from "@/models/Offer";
import {acceptOffer, cancelOffer, closeOffer, completeShakedOffer,} from "@/reducers/exchange/action";

class FeedMeSwapContainer extends React.PureComponent {
  constructor(props) {
    super(props);

    const { initUserId, shakeUserIds, extraData } = props;
    const offer = Offer.offer(JSON.parse(extraData));

    this.userType = getHandshakeUserType(initUserId, shakeUserIds);
    this.offer = offer;
  }

  checkMainNetDefaultWallet = (wallet) => {
    const { checkMainNetDefaultWallet } = this.props;

    if (checkMainNetDefaultWallet) {
      return checkMainNetDefaultWallet(wallet);
    }
  }

  showNotEnoughCoinAlert = (balance, amount, fee, currency) => {
    const { showNotEnoughCoinAlert } = this.props;

    if (showNotEnoughCoinAlert) {
      return showNotEnoughCoinAlert(balance, amount, fee, currency);
    }
  }

  getFrom = () => {
    const { status } = this.props;

    let from = '';
    switch (status) {
      case HANDSHAKE_EXCHANGE_STATUS.PRE_SHAKING:
      case HANDSHAKE_EXCHANGE_STATUS.PRE_SHAKE:
      case HANDSHAKE_EXCHANGE_STATUS.SHAKING:
      case HANDSHAKE_EXCHANGE_STATUS.SHAKE:
      case HANDSHAKE_EXCHANGE_STATUS.REJECTING:
      case HANDSHAKE_EXCHANGE_STATUS.REJECTED:
      case HANDSHAKE_EXCHANGE_STATUS.CANCELLING:
      case HANDSHAKE_EXCHANGE_STATUS.CANCELLED:
      case HANDSHAKE_EXCHANGE_STATUS.COMPLETING:
      case HANDSHAKE_EXCHANGE_STATUS.COMPLETED: {
        switch (this.userType) {
          case HANDSHAKE_USER.OWNER: {
            from = <FormattedMessage id="ex.me.label.with" />;
            break;
          }
          case HANDSHAKE_USER.SHAKED: {
            from = <FormattedMessage id="ex.me.label.from" />;
            break;
          }
          default: {
            // code
            break;
          }
        }

        break;
      }
      default: {
        from = <FormattedMessage id="ex.me.label.from" />;
        break;
      }
    }

    return from;
  }

  getEmail = () => {
    const {
      email, contactPhone, currency, userAddress,
    } = this.offer;

    if (email) { return email; }
    if (contactPhone) { return contactPhone; }
    if (currency === CRYPTO_CURRENCY.ETH) {
      const wallet = new Ethereum();
      wallet.address = userAddress;
      return wallet.getShortAddress();
    }
    if (currency === CRYPTO_CURRENCY.BTC) {
      const wallet = new Bitcoin();
      wallet.address = userAddress;
      return wallet.getShortAddress();
    }
    return '';
  }

  getChatUserName = () => {
    const { initUserId, shakeUserIds } = this.props;

    let chatUserName = '';

    switch (this.userType) {
      case HANDSHAKE_USER.NORMAL: {
        break;
      }
      case HANDSHAKE_USER.SHAKED: {
        chatUserName = initUserId;
        break;
      }
      case HANDSHAKE_USER.OWNER: {
        chatUserName = shakeUserIds && shakeUserIds.length > 0 ? shakeUserIds[0] : '';
        break;
      }
      default: {
        // code
        break;
      }
    }
    return chatUserName?.toString() || '';
  }

  getMessageContent = () => {
    const { status } = this.props;
    // console.log('thisss', this.offer)
    const { offer } = this;
    let message = '';

    let offerType = '';
    switch (status) {
      case HANDSHAKE_EXCHANGE_STATUS.PRE_SHAKING:
      case HANDSHAKE_EXCHANGE_STATUS.PRE_SHAKE:
      case HANDSHAKE_EXCHANGE_STATUS.SHAKING:
      case HANDSHAKE_EXCHANGE_STATUS.SHAKE:
      case HANDSHAKE_EXCHANGE_STATUS.COMPLETING:
      case HANDSHAKE_EXCHANGE_STATUS.COMPLETED: {
        switch (this.userType) {
          case HANDSHAKE_USER.SHAKED: {
            offerType = EXCHANGE_ACTION_PAST_NAME[offer.type];
            break;
          }
          case HANDSHAKE_USER.OWNER: {
            if (offer.type === EXCHANGE_ACTION.BUY) {
              offerType = EXCHANGE_ACTION_PAST_NAME[EXCHANGE_ACTION.SELL];
            } else if (offer.type === EXCHANGE_ACTION.SELL) {
              offerType = EXCHANGE_ACTION_PAST_NAME[EXCHANGE_ACTION.BUY];
            }
            break;
          }
          default: {
            // code
            break;
          }
        }

        // offerType = EXCHANGE_ACTION_PAST_NAME[offer.type];
        message = (<FormattedMessage
          id="offerHandShakeExchangeContentMeDone"
          values={{
            offerType,
            something: offer.physicalItem,
            amount: formatAmountCurrency(offer.amount),
            currency: offer.currency,
          }}
        />);

        break;
      }
      case HANDSHAKE_EXCHANGE_STATUS.CREATED:
      case HANDSHAKE_EXCHANGE_STATUS.ACTIVE:
      case HANDSHAKE_EXCHANGE_STATUS.CLOSING:
      case HANDSHAKE_EXCHANGE_STATUS.CLOSED:
      case HANDSHAKE_EXCHANGE_STATUS.REJECTING:
      case HANDSHAKE_EXCHANGE_STATUS.REJECTED:
      case HANDSHAKE_EXCHANGE_STATUS.CANCELLING:
      case HANDSHAKE_EXCHANGE_STATUS.CANCELLED: {
        switch (this.userType) {
          case HANDSHAKE_USER.SHAKED: {
            offerType = EXCHANGE_ACTION_PRESENT_NAME[offer.type];
            break;
          }
          case HANDSHAKE_USER.OWNER: {
            if (offer.type === EXCHANGE_ACTION.BUY) {
              offerType = EXCHANGE_ACTION_PRESENT_NAME[EXCHANGE_ACTION.SELL];
            } else if (offer.type === EXCHANGE_ACTION.SELL) {
              offerType = EXCHANGE_ACTION_PRESENT_NAME[EXCHANGE_ACTION.BUY];
            }
            break;
          }
          default: {
            // code
            break;
          }
        }

        message = (<FormattedMessage
          id="offerHandShakeExchangeContentMe"
          values={{
            offerType,
            something: offer.physicalItem,
            amount: formatAmountCurrency(offer.amount),
            currency: offer.currency,
          }}
        />);
        break;
      }
      default: {
        break;
      }
    }

    return message;
  }

  getActionButtons = () => {
    const { status, confirmOfferAction } = this.props;
    const { offer } = this;
    let actionButtons = null;
    let message = '';

    switch (this.userType) {
      case HANDSHAKE_USER.NORMAL: {
        break;
      }
      case HANDSHAKE_USER.OWNER: {
        switch (status) {
          case HANDSHAKE_EXCHANGE_STATUS.ACTIVE: {
            message = <FormattedMessage id="cancelOfferConfirm" values={{}} />;
            actionButtons = (
              <div>
                <Button block className="mt-2 btn btn-secondary" onClick={() => confirmOfferAction(message, this.handleCloseOfferExchange)}><FormattedMessage id="btn.close" /></Button>
              </div>
            );
            break;
          }
          case HANDSHAKE_EXCHANGE_STATUS.PRE_SHAKE: {
            message = <FormattedMessage id="acceptOfferConfirm" values={{ }} />;
            actionButtons = (
              <div>
                {offer.type === EXCHANGE_ACTION.BUY &&
                <Button
                  block
                  className="mt-2"
                  onClick={() => confirmOfferAction(message, this.handleAcceptOfferExchange)}
                ><FormattedMessage id="btn.accept" />
                </Button>
                }
                {offer.type === EXCHANGE_ACTION.BUY &&
                <Button
                  block
                  className="mt-2 btn btn-secondary"
                  onClick={() => confirmOfferAction(message, this.handleCancelOfferExchange)}
                ><FormattedMessage id="btn.cancel" />
                </Button>
                }

              </div>
            );
            break;
          }
          case HANDSHAKE_EXCHANGE_STATUS.SHAKE: {
            message = <FormattedMessage id="rejectOfferConfirm" values={{}} />;
            const message2 = <FormattedMessage id="completeOfferConfirm" values={{}} />;
            actionButtons = (
              <div>
                {offer.type === EXCHANGE_ACTION.SELL &&
                <Button block className="mt-2" onClick={() => confirmOfferAction(message2, this.handleCompleteShakedOfferExchange)}><FormattedMessage id="btn.complete" /></Button>
                }
                <Button block className="mt-2 btn btn-secondary" onClick={() => confirmOfferAction(message, this.handleRejectShakedOfferExchange)}><FormattedMessage id="btn.reject" /></Button>
              </div>
            );
            break;
          }
          default: {
            // code
            break;
          }
        }
        break;
      }
      case HANDSHAKE_USER.SHAKED: {
        switch (status) {
          case HANDSHAKE_EXCHANGE_STATUS.PRE_SHAKE: {
            message = <FormattedMessage id="cancelOfferConfirm" values={{ }} />;
            actionButtons = (
              <div>
                {offer.type === EXCHANGE_ACTION.BUY &&
                <Button
                  block
                  className="mt-2 btn btn-secondary"
                  onClick={() => confirmOfferAction(message, this.handleCancelOfferExchange)}
                ><FormattedMessage id="btn.cancel" />
                </Button>
                }
              </div>
            );
            break;
          }
          case HANDSHAKE_EXCHANGE_STATUS.SHAKE: {
            message = <FormattedMessage id="rejectOfferConfirm" values={{}} />;
            const message2 = <FormattedMessage id="completeOfferConfirm" values={{}} />;
            actionButtons = (
              <div>
                {offer.type === EXCHANGE_ACTION.BUY &&
                <Button block className="mt-2" onClick={() => confirmOfferAction(message2, this.handleCompleteShakedOfferExchange)}><FormattedMessage id="btn.complete" /></Button>
                }
                <Button block className="mt-2 btn btn-secondary" onClick={() => confirmOfferAction(message, this.handleRejectShakedOfferExchange)}><FormattedMessage id="btn.reject" /></Button>
              </div>
            );

            break;
          }
          default: {
            // code
            break;
          }
        }
        break;
      }
      default: {
        // code
        break;
      }
    }

    return actionButtons;
  }

  // //////////////////////
  handleCloseOfferExchange = async () => {
    const { offer } = this;

    if (offer.currency === CRYPTO_CURRENCY.ETH && offer.type === EXCHANGE_ACTION.SELL) {
      const wallet = MasterWallet.getWalletDefault(offer.currency);
      const balance = await wallet.getBalance();
      const fee = await wallet.getFee();

      if (!this.checkMainNetDefaultWallet(wallet)) {
        return;
      }

      if (this.showNotEnoughCoinAlert(balance, 0, fee, offer.currency)) {
        return;
      }
    }

    this.props.showLoading({ message: '' });
    this.props.closeOffer({
      PATH_URL: `${API_URL.EXCHANGE.OFFERS}/${offer.id}`,
      METHOD: 'DELETE',
      successFn: this.handleCloseOfferExchangeSuccess,
      errorFn: this.handleCloseOfferExchangeFailed,
    });
  }

  handleCloseOfferExchangeSuccess = async (res) => {
    const { refreshPage } = this.props;
    const { data } = res;
    const { currency, type } = data;
    const offerShake = Offer.offer(data);

    this.responseExchangeDataChangeSwap(offerShake);

    if (currency === CRYPTO_CURRENCY.ETH && type === EXCHANGE_ACTION.SELL) {
      const wallet = MasterWallet.getWalletDefault(currency);
      const exchangeHandshake = new ExchangeHandshake(wallet.chainId);

      let result = '';

      result = await exchangeHandshake.cancel(data.hid, data.id);

      console.log('handleCloseOfferExchangeSuccess', result);
    }

    this.props.hideLoading();
    this.props.showAlert({
      message: <div className="text-center"><FormattedMessage id="closeOfferSuccessMessage" /></div>,
      timeOut: 2000,
      type: 'success',
      callBack: () => {
        // this.props.fireBaseDataChange( { [`exchange_${data.id}`]: data });
      },
    });
  }

  handleCloseOfferExchangeFailed = (e) => {
    this.props.handleActionFailed(e);
  }

  // //////////////////////
  handleAcceptOfferExchange = async () => {
    const { offer } = this;

    if (offer.currency === CRYPTO_CURRENCY.ETH) {
      const wallet = MasterWallet.getWalletDefault(offer.currency);
      const balance = await wallet.getBalance();
      const fee = await wallet.getFee();

      if (!this.checkMainNetDefaultWallet(wallet)) {
        return;
      }

      if (this.showNotEnoughCoinAlert(balance, 0, fee, offer.currency)) {
        return;
      }
    }

    this.props.showLoading({ message: '' });
    this.props.acceptOffer({
      PATH_URL: `${API_URL.EXCHANGE.OFFERS}/${offer.id}/accept`,
      METHOD: 'POST',
      successFn: this.handleAcceptOfferExchangeSuccess,
      errorFn: this.handleAcceptOfferExchangeFailed,
    });
  }

  handleAcceptOfferExchangeSuccess = async (res) => {
    const { refreshPage } = this.props;
    const { data } = res;
    const {
      currency, hid, id, type,
    } = data;
    console.log('handleAcceptOfferExchangeSuccess', res);

    const offerShake = Offer.offer(data);

    this.responseExchangeDataChangeSwap(offerShake);

    if (currency === CRYPTO_CURRENCY.ETH) {
      const wallet = MasterWallet.getWalletDefault(currency);
      const exchangeHandshake = new ExchangeHandshake(wallet.chainId);

      let result = '';

      result = await exchangeHandshake.shake(hid, id);

      console.log('handleAcceptOfferExchangeSuccess', result);
    }

    this.props.hideLoading();
    this.props.showAlert({
      message: <div className="text-center"><FormattedMessage id="shakeOfferSuccessMessage" /></div>,
      timeOut: 2000,
      type: 'success',
      callBack: () => {
        // this.props.fireBaseDataChange( { [`exchange_${data.id}`]: data });
      },
    });
  }

  handleAcceptOfferExchangeFailed = (e) => {
    this.props.handleActionFailed(e);
  }

  // //////////////////////
  handleCancelOfferExchange = async () => {
    const offer = this.offer;

    if (offer.currency === CRYPTO_CURRENCY.ETH) {
      const wallet = MasterWallet.getWalletDefault(offer.currency);
      const balance = await wallet.getBalance();
      const fee = await wallet.getFee();

      if (!this.checkMainNetDefaultWallet(wallet)) {
        return;
      }

      if (this.showNotEnoughCoinAlert(balance, 0, fee, offer.currency)) {
        return;
      }
    }

    this.props.showLoading({ message: '' });
    this.props.cancelOffer({
      PATH_URL: `${API_URL.EXCHANGE.OFFERS}/${offer.id}/cancel`,
      METHOD: 'POST',
      successFn: this.handleCancelOfferExchangeSuccess,
      errorFn: this.handleCancelOfferExchangeFailed,
    });
  }

  handleCancelOfferExchangeSuccess = async (res) => {
    const { refreshPage } = this.props;
    const { data } = res;
    const { currency, hid, id } = data;

    console.log('handleCancelOfferExchangeSuccess', res);

    const offerShake = Offer.offer(data);

    this.responseExchangeDataChangeSwap(offerShake);

    if (currency === CRYPTO_CURRENCY.ETH) {
      const wallet = MasterWallet.getWalletDefault(currency);

      const exchangeHandshake = new ExchangeHandshake(wallet.chainId);

      const result = await exchangeHandshake.cancel(hid, id);

      console.log('handleCompleteShakedOfferExchangeSuccess', result);
    }

    // console.log('data', data);
    this.props.hideLoading();
    this.props.showAlert({
      message: <div className="text-center"><FormattedMessage id="cancelShakedfferSuccessMessage" /></div>,
      timeOut: 2000,
      type: 'success',
      callBack: () => {
        // if (refreshPage) {
        //   refreshPage();
        // }
      },
    });
  }

  handleCancelOfferExchangeFailed = (e) => {
    this.props.handleActionFailed(e);
  }

  // //////////////////////
  handleCompleteShakedOfferExchange = async () => {
    const offer = this.offer;

    if (offer.currency === CRYPTO_CURRENCY.ETH) {
      const wallet = MasterWallet.getWalletDefault(offer.currency);
      const balance = await wallet.getBalance();
      const fee = await wallet.getFee();

      if (!this.checkMainNetDefaultWallet(wallet)) {
        return;
      }

      if (this.showNotEnoughCoinAlert(balance, 0, fee, offer.currency)) {
        return;
      }
    }

    this.props.showLoading({ message: '' });
    this.props.completeShakedOffer({
      PATH_URL: `${API_URL.EXCHANGE.OFFERS}/${offer.id}/complete`,
      METHOD: 'POST',
      successFn: this.handleCompleteShakedOfferExchangeSuccess,
      errorFn: this.handleCompleteShakedOfferExchangeFailed,
    });
  }

  handleCompleteShakedOfferExchangeSuccess = async (res) => {
    const { refreshPage } = this.props;
    const { data } = res;
    const { currency, hid, id } = data;
    console.log('handleCompleteShakedOfferExchangeSuccess', res);

    const offerShake = Offer.offer(data);

    this.responseExchangeDataChangeSwap(offerShake);

    if (currency === CRYPTO_CURRENCY.ETH) {
      const wallet = MasterWallet.getWalletDefault(currency);

      const exchangeHandshake = new ExchangeHandshake(wallet.chainId);

      const result = await exchangeHandshake.accept(hid, id);

      console.log('handleCompleteShakedOfferExchangeSuccess', result);
    }

    // console.log('data', data);
    this.props.hideLoading();
    this.props.showAlert({
      message: <div className="text-center"><FormattedMessage id="completeShakedfferSuccessMessage" /></div>,
      timeOut: 2000,
      type: 'success',
      callBack: () => {
        // if (refreshPage) {
        //   refreshPage();
        // }
      },
    });
  }

  handleCompleteShakedOfferExchangeFailed = (e) => {
    this.props.handleActionFailed(e);
  }

  // //////////////////////
  handleRejectShakedOfferExchange = async () => {
    const { offer } = this;

    if (offer.currency === CRYPTO_CURRENCY.ETH) {
      const wallet = MasterWallet.getWalletDefault(offer.currency);
      const balance = await wallet.getBalance();
      const fee = await wallet.getFee();

      if (!this.checkMainNetDefaultWallet(wallet)) {
        return;
      }

      if (this.showNotEnoughCoinAlert(balance, 0, fee, offer.currency)) {
        return;
      }
    }

    this.props.showLoading({ message: '' });
    this.props.cancelShakedOffer({
      PATH_URL: `${API_URL.EXCHANGE.OFFERS}/${offer.id}/reject`,
      METHOD: 'POST',
      successFn: this.handleRejectShakedOfferExchangeSuccess,
      errorFn: this.handleRejectShakedOfferExchangeFailed,
    });
  }

  handleRejectShakedOfferExchangeSuccess = async (res) => {
    const { refreshPage } = this.props;
    const { data } = res;
    const {
      currency, type, hid, id,
    } = data;

    console.log('handleRejectShakedOfferExchangeSuccess', res);

    const offerShake = Offer.offer(data);

    this.responseExchangeDataChangeSwap(offerShake);

    if (currency === CRYPTO_CURRENCY.ETH) {
      const wallet = MasterWallet.getWalletDefault(currency);

      const exchangeHandshake = new ExchangeHandshake(wallet.chainId);

      let result = null;

      // if ((data.type === EXCHANGE_ACTION.BUY && this.userType === HANDSHAKE_USER.OWNER) ||
      //   (data.type === EXCHANGE_ACTION.SELL && this.userType === HANDSHAKE_USER.SHAKED)
      // ) {
      //   result = await exchangeHandshake.reject(data.hid, data.id);
      // } else {
      //   result = await exchangeHandshake.cancel(data.hid, data.id);
      // }
      result = await exchangeHandshake.cancel(hid, id);

      console.log('handleRejectShakedOfferExchangeSuccess', result);
    }

    this.props.hideLoading();
    this.props.showAlert({
      message: <div className="text-center"><FormattedMessage id="cancelShakedfferSuccessMessage" /></div>,
      timeOut: 2000,
      type: 'success',
      callBack: () => {
        // if (refreshPage) {
        //   refreshPage();
        // }
      },
    });
  }

  handleRejectShakedOfferExchangeFailed = (e) => {
    this.props.handleActionFailed(e);
  }

  // //////////////////////

  responseExchangeDataChange = (offerShake) => {
    const { id, status } = offerShake;
    const data = {};
    const firebaseOffer = {};

    firebaseOffer.id = id;
    firebaseOffer.status = status;
    firebaseOffer.type = 'exchange';

    data[`exchange_${id}`] = firebaseOffer;

    console.log('responseExchangeDataChange', data);

    this.props.responseExchangeDataChange(data);
  }

  getMessageMovingCoin = () => {
    const { status } = this.props;
    const { offer } = this;

    let idMessage = '';

    switch (status) {
      case HANDSHAKE_EXCHANGE_STATUS.CREATED:
      case HANDSHAKE_EXCHANGE_STATUS.SHAKING:
      case HANDSHAKE_EXCHANGE_STATUS.COMPLETING: {
        switch (this.userType) {
          case HANDSHAKE_USER.NORMAL: {
            break;
          }
          case HANDSHAKE_USER.SHAKED: { // user shake
            if (offer.type === EXCHANGE_ACTION.BUY) { // shop buy
              idMessage = 'movingCoinToEscrow';
            }
            break;
          }
          case HANDSHAKE_USER.OWNER: { // shop
            if (offer.type === EXCHANGE_ACTION.SELL) { // shop sell
              idMessage = 'movingCoinToEscrow';
            }
            break;
          }
          default: {
            // code
            break;
          }
        }

        break;
      }

      case HANDSHAKE_EXCHANGE_STATUS.CLOSING:
      case HANDSHAKE_EXCHANGE_STATUS.REJECTING: {
        switch (this.userType) {
          case HANDSHAKE_USER.NORMAL: {
            break;
          }
          case HANDSHAKE_USER.SHAKED: { // user shake
            if (offer.type === EXCHANGE_ACTION.BUY) { // shop buy
              idMessage = 'movingCoinFromEscrow';
            }
            break;
          }
          case HANDSHAKE_USER.OWNER: { // shop
            if (offer.type === EXCHANGE_ACTION.SELL) { // shop sell
              idMessage = 'movingCoinFromEscrow';
            }
            break;
          }
          default: {
            // code
            break;
          }
        }
        break;
      }

      case HANDSHAKE_EXCHANGE_STATUS.ACTIVE:
      case HANDSHAKE_EXCHANGE_STATUS.CLOSED:
      case HANDSHAKE_EXCHANGE_STATUS.SHAKE:
      case HANDSHAKE_EXCHANGE_STATUS.COMPLETED:
      case HANDSHAKE_EXCHANGE_STATUS.REJECTED: {
        break;
      }
      default: {
        // code
        break;
      }
    }

    let message = '';
    if (idMessage) {
      message = <FormattedMessage id={idMessage} values={{}} />;
    }

    return message;
  }

  render() {
    const { extraData, status } = this.props;

    const offer = Offer.offer(JSON.parse(extraData));
    this.offer = offer;

    const from = this.getFrom();
    const email = this.getEmail();
    const statusText = HANDSHAKE_EXCHANGE_STATUS_NAME[status];
    let showChat = false;
    let chatUsername = '';

    switch (status) {
      case HANDSHAKE_EXCHANGE_STATUS.PRE_SHAKING:
      case HANDSHAKE_EXCHANGE_STATUS.PRE_SHAKE:
      case HANDSHAKE_EXCHANGE_STATUS.SHAKING:
      case HANDSHAKE_EXCHANGE_STATUS.SHAKE:
      case HANDSHAKE_EXCHANGE_STATUS.COMPLETING:
      case HANDSHAKE_EXCHANGE_STATUS.COMPLETED: {
        chatUsername = this.getChatUserName();

        showChat = chatUsername.length > 0;

        break;
      }
      default: {
        // code
        break;
      }
    }

    const nameShop = <FormattedMessage id="ex.me.label.about" />;
    const message = this.getMessageContent();
    const actionButtons = this.getActionButtons();
    const messageMovingCoin = this.getMessageMovingCoin();

    const feedProps = {
      from, email, statusText, message,
      showChat, chatUsername,
      nameShop,
      messageMovingCoin,
      actionButtons,
    };

    return (
      <div>
        <FeedMeCash {...this.props} {...feedProps} />
      </div>
    );
  }
}

FeedMeSwapContainer.propTypes = {
  className: PropTypes.string,
  background: PropTypes.string,
};

const mapState = state => ({
  listOfferPrice: state.exchange.listOfferPrice,
});

const mapDispatch = ({
  showAlert,
  showLoading,
  hideLoading,

  closeOffer,
  acceptOffer,
  cancelOffer,
  completeShakedOffer,

  responseExchangeDataChange,
});

export default connect(mapState, mapDispatch)(FeedMeSwapContainer);
