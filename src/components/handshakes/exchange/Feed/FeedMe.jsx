import React from 'react';
import PropTypes from 'prop-types';
import iconLocation from '@/assets/images/icon/icons8-geo_fence.svg';
import iconTransaction from '@/assets/images/icon/icons8-transfer_between_users.svg';
import iconPhone from '@/assets/images/icon/icons8-phone.svg';
import iconChat from '@/assets/images/icon/icons8-chat.svg';
// style
import './FeedExchange.scss';
import {FormattedMessage, injectIntl} from 'react-intl';
import Feed from "@/components/core/presentation/Feed/Feed";
import Button from "@/components/core/controls/Button/Button";
import {
  API_URL,
  CRYPTO_CURRENCY,
  DEFAULT_FEE,
  EXCHANGE_ACTION,
  EXCHANGE_ACTION_NAME,
  EXCHANGE_FEED_TYPE,
  EXCHANGE_METHOD_PAYMENT,
  HANDSHAKE_EXCHANGE_CC_STATUS_NAME,
  HANDSHAKE_EXCHANGE_STATUS,
  HANDSHAKE_EXCHANGE_STATUS_NAME,
  HANDSHAKE_STATUS_NAME,
  HANDSHAKE_USER,
  APP_USER_NAME,
  EXCHANGE_ACTION_PAST_NAME,
  EXCHANGE_ACTION_PRESENT_NAME,
  EXCHANGE_ACTION_PERSON
} from "@/constants";
import ModalDialog from "@/components/core/controls/ModalDialog";
import {connect} from "react-redux";
import {
  cancelShakedOffer,
  closeOffer,
  completeShakedOffer,
  shakeOffer,
  withdrawShakedOffer
} from "@/reducers/exchange/action";
// import getSymbolFromCurrency from 'currency-symbol-map';
import Offer from "@/models/Offer";
import {MasterWallet} from "@/models/MasterWallet";
import {getHandshakeUserType, getOfferPrice} from "@/services/offer-util";
import {showAlert} from '@/reducers/app/action';
import {Link} from "react-router-dom";
import {URL} from '@/constants';
import {getDistanceFromLatLonInKm} from '../utils'
import {ExchangeHandshake} from '@/services/neuron';
import _sample from "lodash/sample";
import { feedBackgroundColors } from "@/components/handshakes/exchange/config";
import {updateOfferStatus} from "@/reducers/discover/action";
import {formatAmountCurrency, formatMoney} from "@/services/offer-util";
import {BigNumber} from "bignumber.js";
import { showLoading, hideLoading } from '@/reducers/app/action';
import "./FeedMe.scss"
import {HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS, HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS} from "../../../../constants";
import {
  acceptOfferItem, cancelOfferItem, completeOfferItem,
  rejectOfferItem
} from "../../../../reducers/exchange/action";
import {ExchangeShopHandshake} from "../../../../services/neuron";

class FeedMe extends React.PureComponent {
  constructor(props) {
    super(props);

    const {initUserId, shakeUserIds, extraData} = props;
    const offer = Offer.offer(JSON.parse(extraData));

    this.userType = getHandshakeUserType(initUserId, shakeUserIds);
    this.offer = offer;

    this.state = {
      modalContent: '',
    };
    this.mainColor = _sample(feedBackgroundColors)
  }

  showNotEnoughCoinAlert = (balance, amount, fee, currency) => {
    const bnBalance = new BigNumber(balance);
    const bnAmount = new BigNumber(amount);
    const bnFee = new BigNumber(fee);

    const condition = bnBalance.isLessThan(bnAmount.plus(bnFee));

    if (condition) {
      const { intl } = this.props;
      this.props.showAlert({
        message: <div className="text-center">
          {intl.formatMessage({ id: 'notEnoughCoinInWallet' }, {
            amount: formatAmountCurrency(balance),
            fee: formatAmountCurrency(fee),
            currency: currency,
          })}
        </div>,
        timeOut: 3000,
        type: 'danger',
        callBack: () => {
        }
      });
    }

    return condition;
  }

  getContent = () => {
    const {intl, status} = this.props;
    const offer = this.offer;
    const fiatAmount = this.fiatAmount;
    let message = '';
    let offerType = '';

    switch (this.userType) {
      case HANDSHAKE_USER.NORMAL: {
        break;
      }
      case HANDSHAKE_USER.SHAKED: {
        switch (status) {
          case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.PRE_SHAKING:
          case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.PRE_SHAKE:
          case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.REJECTING:
          case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.REJECTED: {

            if (offer.type === EXCHANGE_ACTION.BUY) {
              offerType = EXCHANGE_ACTION_PRESENT_NAME[EXCHANGE_ACTION.SELL];
            } else if (offer.type === EXCHANGE_ACTION.SELL) {
              offerType = EXCHANGE_ACTION_PRESENT_NAME[EXCHANGE_ACTION.BUY];
            }

            break;
          }
          case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.SHAKING:
          case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.SHAKE:
          case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.COMPLETING:
          case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.COMPLETED: {

            if (offer.type === EXCHANGE_ACTION.BUY) {
              offerType = EXCHANGE_ACTION_PAST_NAME[EXCHANGE_ACTION.SELL];
            } else if (offer.type === EXCHANGE_ACTION.SELL) {
              offerType = EXCHANGE_ACTION_PAST_NAME[EXCHANGE_ACTION.BUY];
            }

            break;
          }
        }

        break;
      }
      case HANDSHAKE_USER.OWNER: {
        switch (status) {
          case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.PRE_SHAKING:
          case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.PRE_SHAKE:
          case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.REJECTING:
          case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.REJECTED: {

            offerType = EXCHANGE_ACTION_PRESENT_NAME[offer.type];

            break;
          }
          case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.SHAKING:
          case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.SHAKE:
          case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.COMPLETING:
          case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.COMPLETED: {

            offerType = EXCHANGE_ACTION_PAST_NAME[offer.type];

            break;
          }
        }
      }
    }
  }

  getActionButtons = () => {
    const {intl, status} = this.props;
    const offer = this.offer;
    const fiatAmount = this.fiatAmount;
    let actionButtons = null;
    let message = '';

    switch (this.userType) {
      case HANDSHAKE_USER.NORMAL: {
        break;
      }
      case HANDSHAKE_USER.SHAKED: {
        switch (status) {
          case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.PRE_SHAKE: {
            let message = intl.formatMessage({id: 'cancelOfferItemSuccessMassage'}, {});
            actionButtons = (
              <div>
                <Button block className="mt-2"
                        onClick={() => this.confirmOfferAction(message, this.handleCancelShakeOffer)}>Cancel</Button>
              </div>
            );
          }
          case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.SHAKE: {
            // actionButtons = 'Reject'; // complete: nguoi nhan cash
            message = intl.formatMessage({id: 'rejectOfferConfirm'}, {});
            let message2 = intl.formatMessage({id: 'completeOfferConfirm'}, {});
            actionButtons = (
              <div>
                <Button block className="mt-2"
                        onClick={() => this.confirmOfferAction(message, this.handleRejectShakedOffer)}>Reject</Button>
                {offer.type === EXCHANGE_ACTION.BUY &&
                <Button block className="mt-2"
                        onClick={() => this.confirmOfferAction(message2, this.handleCompleteShakedOffer)}>Complete</Button>
                }
              </div>
            );
            break;
          }
        }
        break;
      }
      case HANDSHAKE_USER.OWNER: {
        switch (status) {
          case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.PRE_SHAKE: {
            message = intl.formatMessage({id: 'acceptOfferItemSuccessMassage'}, {});
            actionButtons = (
              <div>
                <Button block className="mt-2"
                        onClick={() => this.confirmOfferAction(message, this.handleAcceptShakedOffer)}>Accept</Button>
              </div>
            );
            break;
          }
          case HANDSHAKE_EXCHANGE_SHOP_OFFER_SHAKE_STATUS.SHAKE: {
            // actionButtons = 'Reject'; // complete: nguoi nhan cash
            message = intl.formatMessage({id: 'rejectOfferConfirm'}, {});
            let message2 = intl.formatMessage({id: 'completeOfferConfirm'}, {});
            actionButtons = (
              <div>
                <Button block className="mt-2"
                        onClick={() => this.confirmOfferAction(message, this.handleRejectShakedOffer)}>Reject</Button>
                {offer.type === EXCHANGE_ACTION.SELL &&
                <Button block className="mt-2"
                        onClick={() => this.confirmOfferAction(message2, this.handleCompleteShakedOffer)}>Complete</Button>
                }
              </div>
            );
            break;
          }
        }
      }
    }
  }

  ////////////////////////

  handleRejectShakedOffer = async () => {
    const { offer, initUserId } = this;

    if (offer.currency === CRYPTO_CURRENCY.ETH) {
      const wallet = MasterWallet.getWalletDefault(offer.currency);
      const balance = await wallet.getBalance();
      const fee = await wallet.getFee();

      if (this.showNotEnoughCoinAlert(balance, 0, fee, offer.currency)) {
        return;
      }
    }

    this.showLoading();
    this.props.rejectOfferItem({
      PATH_URL: `${API_URL.EXCHANGE.OFFER_STORES}/${initUserId}/${API_URL.EXCHANGE.SHAKES}/${offer.id}`,
      METHOD: 'DELETE',
      successFn: this.handleRejectShakedOfferSuccess,
      errorFn: this.handleRejectShakedOfferFailed,
    });
  }

  handleRejectShakedOfferSuccess = async (responseData) => {
    const { refreshPage } = this.props;
    const { data } = responseData;
    const { currency } = data;

    if (currency === CRYPTO_CURRENCY.ETH) {
      const wallet = MasterWallet.getWalletDefault(currency);

      const exchangeHandshake = new ExchangeShopHandshake(wallet.chainId);

      let result = null;

      if ((data.type === EXCHANGE_ACTION.BUY && this.userType === HANDSHAKE_USER.OWNER) ||
        (data.type === EXCHANGE_ACTION.SELL && this.userType === HANDSHAKE_USER.SHAKED)
      ) {
        result = await exchangeHandshake.reject(data.hid, data.id);
      } else {
        result = await exchangeHandshake.cancel(data.hid, data.id);
      }

      console.log('handleCancelShakedOfferSuccess', result);
    }

    this.hideLoading();
    this.props.showAlert({
      message: <div className="text-center"><FormattedMessage id="rejectOfferItemSuccessMassage"/></div>,
      timeOut: 2000,
      type: 'success',
      callBack: () => {
        // if (refreshPage) {
        //   refreshPage();
        // }
      }
    });
  }

  handleRejectShakedOfferFailed = (e) => {
    this.handleActionFailed(e);
  }

  ////////////////////////
  handleCancelShakeOffer = async () => {
    const { offer, initUserId } = this;

    if (offer.currency === CRYPTO_CURRENCY.ETH) {
      const wallet = MasterWallet.getWalletDefault(offer.currency);
      const balance = await wallet.getBalance();
      const fee = await wallet.getFee();

      if (this.showNotEnoughCoinAlert(balance, 0, fee, offer.currency)) {
        return;
      }
    }

    this.showLoading();
    this.props.cancelOfferItem({
      PATH_URL: `${API_URL.EXCHANGE.OFFER_STORES}/${initUserId}/${API_URL.EXCHANGE.SHAKES}/${offer.id}/cancel`,
      METHOD: 'POST',
      successFn: this.handleCancelShakeOfferSuccess,
      errorFn: this.handleCancelShakeOfferFailed,
    });
  }

  handleCancelShakeOfferSuccess = async (responseData) => {
    const { refreshPage } = this.props;
    const { data } = responseData;
    const { currency } = data;

    if (currency === CRYPTO_CURRENCY.ETH) {
      const wallet = MasterWallet.getWalletDefault(currency);

      const exchangeHandshake = new ExchangeShopHandshake(wallet.chainId);

      let result = null;

      // if ((data.type === EXCHANGE_ACTION.BUY && this.userType === HANDSHAKE_USER.OWNER) ||
      //   (data.type === EXCHANGE_ACTION.SELL && this.userType === HANDSHAKE_USER.SHAKED)
      // ) {
      //   result = await exchangeHandshake.reject(data.hid, data.id);
      // } else {
        result = await exchangeHandshake.cancel(data.hid, data.id);
      // }

      console.log('handleCancelShakedOfferSuccess', result);
    }

    this.hideLoading();
    this.props.showAlert({
      message: <div className="text-center"><FormattedMessage id="rejectOfferItemSuccessMassage"/></div>,
      timeOut: 2000,
      type: 'success',
      callBack: () => {
        // if (refreshPage) {
        //   refreshPage();
        // }
      }
    });
  }

  handleCancelShakeOfferFailed = (e) => {
    this.handleActionFailed(e);
  }

  ////////////////////////

  handleCompleteShakedOffer = async () => {
    const { offer, initUserId } = this;

    if (offer.currency === CRYPTO_CURRENCY.ETH) {
      const wallet = MasterWallet.getWalletDefault(offer.currency);
      const balance = await wallet.getBalance();
      const fee = await wallet.getFee();

      if (this.showNotEnoughCoinAlert(balance, offer.totalAmount, fee, offer.currency)) {
        return;
      }
    }

    this.showLoading();
    this.props.completeOfferItem({
      PATH_URL: `${API_URL.EXCHANGE.OFFER_STORES}/${initUserId}/${API_URL.EXCHANGE.SHAKES}/${offer.id}/complete`,
      METHOD: 'POST',
      successFn: this.handleCompleteShakedOfferSuccess,
      errorFn: this.handleCompleteShakedOfferFailed,
    });
  }

  handleCompleteShakedOfferSuccess = async (responseData) => {
    const { offer, initUserId } = this;
    const { refreshPage } = this.props;
    const { data } = responseData;
    const { currency } = data;

    if (currency === CRYPTO_CURRENCY.ETH) {
      const wallet = MasterWallet.getWalletDefault(currency);

      const exchangeHandshake = new ExchangeShopHandshake(wallet.chainId);

      // let result = await exchangeHandshake.finish(data.hid, data.id);

      let result = null;

      let customerAddress = '';

      if (data.type === EXCHANGE_ACTION.SELL && this.userType === HANDSHAKE_USER.OWNER) {
        result = await exchangeHandshake.releasePartialFund(data.hid, customerAddress ,data.totalAmount, initUserId, data.id);
      } else if (data.type === EXCHANGE_ACTION.BUY && this.userType === HANDSHAKE_USER.SHAKED){
        result = await exchangeHandshake.finish(data.hid, data.id);
      }

      console.log('handleCompleteShakedOfferSuccess', result);
    }

    // console.log('data', data);
    this.hideLoading();
    this.props.showAlert({
      message: <div className="text-center"><FormattedMessage id="completeOfferItemSuccessMassage"/></div>,
      timeOut: 2000,
      type: 'success',
      callBack: () => {
        // if (refreshPage) {
        //   refreshPage();
        // }
      }
    });
  }

  handleCompleteShakedOfferFailed = (e) => {
    this.handleActionFailed(e);
  }

  ////////////////////////

  handleAcceptShakedOffer = async () => {
    const { offer, initUserId } = this;

    if (offer.currency === CRYPTO_CURRENCY.ETH) {
      const wallet = MasterWallet.getWalletDefault(offer.currency);
      const balance = await wallet.getBalance();
      const fee = await wallet.getFee();

      if (this.showNotEnoughCoinAlert(balance, offer.totalAmount, fee, offer.currency)) {
        return;
      }
    }

    this.showLoading();
    this.props.acceptOfferItem({
      PATH_URL: `${API_URL.EXCHANGE.OFFER_STORES}/${initUserId}/${API_URL.EXCHANGE.SHAKES}/${offer.id}/complete`,
      METHOD: 'POST',
      successFn: this.handleAcceptShakedOfferSuccess,
      errorFn: this.handleAcceptShakedOfferFailed,
    });
  }

  handleAcceptShakedOfferSuccess = async (responseData) => {
    const { refreshPage } = this.props;
    const { data } = responseData;
    const { currency } = data;

    if (currency === CRYPTO_CURRENCY.ETH) {
      const wallet = MasterWallet.getWalletDefault(currency);

      const exchangeHandshake = new ExchangeShopHandshake(wallet.chainId);

      let result = await exchangeHandshake.shake(data.hid, data.id);

      console.log('handleAcceptShakedOfferSuccess', result);
    }

    // console.log('data', data);
    this.hideLoading();
    this.props.showAlert({
      message: <div className="text-center"><FormattedMessage id="acceptOfferItemSuccessMassage"/></div>,
      timeOut: 2000,
      type: 'success',
      callBack: () => {
        // if (refreshPage) {
        //   refreshPage();
        // }
      }
    });
  }

  handleAcceptShakedOfferFailed = (e) => {
    this.handleActionFailed(e);
  }

  handleActionFailed = (e) => {
    this.hideLoading();
    // console.log('e', e);
    this.props.showAlert({
      message: <div className="text-center">{e.response?.data?.message}</div>,
      timeOut: 3000,
      type: 'danger',
      callBack: () => {
        // this.props.history.push(URL.HANDSHAKE_ME);
      }
    });
  }

  calculateFiatAmount = (offer) => {
    const { listOfferPrice } = this.props;
    let fiatAmount = 0;

    if (offer.fiatAmount) {
      fiatAmount = offer.fiatAmount;
    } else {
      if (listOfferPrice) {
        let offerPrice = getOfferPrice(listOfferPrice, offer.type, offer.currency);
        if (offerPrice) {
          fiatAmount = offer.amount * offerPrice.price || 0;
          fiatAmount = fiatAmount + fiatAmount * offer.percentage / 100;
        } else {
          console.log('aaaa', offer.type, offer.currency);
        }
      }
      // this.fiatAmount = fiatAmount;
    }
    return fiatAmount;
  }

  render() {
    // const email = 'abc@mail.com'
    // const statusText = 'pending'
    // const buyerSeller = 'buyer'
    // const phone = '+84-123456789'
    // const phoneDisplayed = phone.replace(/-/g, '')
    // const address = '81 Boulevaoud'
    // const distanceKm = 12342134
    // const distanceMiles = 1.23
    // const message = 'Sample message aowiejf oawei fawoei fjaweo fiwaj fe'
    // const nameShop = 'CryptoWorkshop'

    const {intl, initUserId, shakeUserIds, location, state, status, mode = 'discover', ipInfo: { latitude, longitude }, initAt, ...props} = this.props;
    const offer = this.offer;
    console.log('render',offer);
    const {listOfferPrice} = this.props;

    let modalContent = this.state.modalContent;

    // let email = '';
    // if (offer.feedType === EXCHANGE_FEED_TYPE.EXCHANGE) {
    //   email = offer.email ? offer : offer.contactPhone ? offer.contactPhone : offer.contactInfo;
    // } else if (offer.feedType === EXCHANGE_FEED_TYPE.INSTANT) {
    //   email = APP_USER_NAME;
    // }

    let email = '';
    let statusText = '';
    let message = '';
    let message2 = '';
    let actionButtons = null;
    let from = 'From';
    let showChat = false;
    let chatUsername = '';
    // let buyerSeller = this.getBuyerSeller();
    let nameShop = offer.username;

    switch (offer.feedType) {
      // case EXCHANGE_FEED_TYPE.EXCHANGE: {
      //   statusText = HANDSHAKE_EXCHANGE_STATUS_NAME[status];
      //
      //   let offerType = '';
      //   if (mode === 'me') {
      //     switch (status) {
      //       case HANDSHAKE_EXCHANGE_STATUS.SHAKING:
      //       case HANDSHAKE_EXCHANGE_STATUS.SHAKE:
      //       case HANDSHAKE_EXCHANGE_STATUS.COMPLETING:
      //       case HANDSHAKE_EXCHANGE_STATUS.COMPLETED:
      //       case HANDSHAKE_EXCHANGE_STATUS.WITHDRAWING:
      //       case HANDSHAKE_EXCHANGE_STATUS.WITHDRAW: {
      //         switch (this.userType) {
      //           case HANDSHAKE_USER.SHAKED: {
      //             from = 'With';
      //             if (offer.type === EXCHANGE_ACTION.BUY) {
      //               offerType = EXCHANGE_ACTION_PAST_NAME[EXCHANGE_ACTION.SELL];
      //             } else if (offer.type === EXCHANGE_ACTION.SELL) {
      //               offerType = EXCHANGE_ACTION_PAST_NAME[EXCHANGE_ACTION.BUY];
      //             }
      //             break;
      //           }
      //           case HANDSHAKE_USER.OWNER: {
      //             from = 'From';
      //
      //             offerType = EXCHANGE_ACTION_PAST_NAME[offer.type];
      //             break;
      //           }
      //         }
      //
      //         // offerType = EXCHANGE_ACTION_PAST_NAME[offer.type];
      //         message = intl.formatMessage({ id: 'offerHandShakeContentMeDone' }, {
      //           offerType: offerType,
      //           amount: formatAmountCurrency(offer.amount),
      //           currency: offer.currency,
      //           currency_symbol: offer.fiatCurrency,
      //           total: formatMoney(fiatAmount),
      //           fee: offer.feePercentage,
      //           payment_method: EXCHANGE_METHOD_PAYMENT[EXCHANGE_FEED_TYPE.EXCHANGE],
      //         });
      //         break;
      //       }
      //       default: {
      //         switch (this.userType) {
      //           case HANDSHAKE_USER.SHAKED: {
      //             from = 'With';
      //             if (offer.type === EXCHANGE_ACTION.BUY) {
      //               offerType = EXCHANGE_ACTION_PRESENT_NAME[EXCHANGE_ACTION.SELL];
      //             } else if (offer.type === EXCHANGE_ACTION.SELL) {
      //               offerType = EXCHANGE_ACTION_PRESENT_NAME[EXCHANGE_ACTION.BUY];
      //             }
      //             break;
      //           }
      //           case HANDSHAKE_USER.OWNER: {
      //             from = 'From';
      //
      //             offerType = EXCHANGE_ACTION_PRESENT_NAME[offer.type];
      //
      //             break;
      //           }
      //         }
      //
      //         message = intl.formatMessage({ id: 'offerHandShakeContentMe' }, {
      //           offerType: offerType,
      //           amount: formatAmountCurrency(offer.amount),
      //           currency: offer.currency,
      //           currency_symbol: offer.fiatCurrency,
      //           total: formatMoney(fiatAmount),
      //           fee: offer.feePercentage,
      //           payment_method: EXCHANGE_METHOD_PAYMENT[EXCHANGE_FEED_TYPE.EXCHANGE],
      //         });
      //         break;
      //       }
      //     }
      //
      //     //Check show chat
      //     switch (status) {
      //       case HANDSHAKE_EXCHANGE_STATUS.CREATED:
      //       case HANDSHAKE_EXCHANGE_STATUS.ACTIVE:
      //       case HANDSHAKE_EXCHANGE_STATUS.CLOSING:
      //       case HANDSHAKE_EXCHANGE_STATUS.CLOSED: {
      //         showChat = false;
      //         break;
      //       }
      //       default: {
      //         showChat = true;
      //
      //         switch (this.userType) {
      //           case HANDSHAKE_USER.NORMAL: {
      //             break;
      //           }
      //           case HANDSHAKE_USER.SHAKED: {
      //             chatUsername = offer.username;
      //             break;
      //           }
      //           case HANDSHAKE_USER.OWNER: {
      //             chatUsername = offer.toUsername;
      //             break;
      //           }
      //         }
      //       }
      //     }
      //   } else {
      //     message = intl.formatMessage({ id: 'offerHandShakeContent' }, {
      //       offerType: offer.type === EXCHANGE_ACTION.BUY ? EXCHANGE_ACTION_NAME[EXCHANGE_ACTION.SELL] : EXCHANGE_ACTION_NAME[EXCHANGE_ACTION.BUY],
      //       amount: formatAmountCurrency(offer.amount),
      //       currency: offer.currency,
      //       currency_symbol: offer.fiatCurrency,
      //       total: formatMoney(fiatAmount),
      //       payment_method: EXCHANGE_METHOD_PAYMENT[EXCHANGE_FEED_TYPE.EXCHANGE]
      //     });
      //   }
      //
      //   actionButtons = this.getActionButtons();
      //   break;
      // }
      case EXCHANGE_FEED_TYPE.INSTANT: {
        email = APP_USER_NAME;
        statusText = HANDSHAKE_EXCHANGE_CC_STATUS_NAME[status];
        let just = ' ';

        var hours = Math.abs(Date.now() - (initAt * 1000)) / 36e5;

        if (hours < 4) {
          just = ' just ';
        }

        let fiatAmount = this.calculateFiatAmount(offer);
        message = intl.formatMessage({ id: 'instantOfferHandShakeContent' }, {
          just: just,
          offerType: 'bought',
          amount: formatAmountCurrency(offer.amount),
          currency: offer.currency,
          currency_symbol: offer.fiatCurrency,
          total: formatMoney(fiatAmount),
          fee: offer.feePercentage,
        });

        actionButtons = null;
        break;
      }
      case EXCHANGE_FEED_TYPE.OFFER_STORE: {
        email = offer.email ? offer.email : offer.contactPhone ? offer.contactPhone : offer.contactInfo;

        switch (status) {
          case HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS.CREATED:
          case HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS.ACTIVE:
          case HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS.CLOSING:
          case HANDSHAKE_EXCHANGE_SHOP_OFFER_STATUS.CLOSED: {
              // message = intl.formatMessage({ id: 'offerHandShakeContentMe' }, {
              //   offerType: offerType,
              //   amount: formatAmountCurrency(offer.amount),
              //   currency: offer.currency,
              //   currency_symbol: offer.fiatCurrency,
              //   total: formatMoney(fiatAmount),
              //   fee: offer.feePercentage,
              //   payment_method: EXCHANGE_METHOD_PAYMENT[EXCHANGE_FEED_TYPE.EXCHANGE],
              // });
            break;
          }
        }

        // actionButtons = this.getActionButtons();
        break;
      }
      case EXCHANGE_FEED_TYPE.OFFER_STORE_SHAKE: {
        email = offer.email ? offer.email : offer.contactPhone ? offer.contactPhone : offer.contactInfo;
        showChat = true;
        chatUsername = offer.toUsername;



        actionButtons = this.getActionButtons();
        break;
      }
    }

    /*const phone = offer.contactPhone;
    const address = offer.contactInfo;*/

    let distanceKm = 0;
    let distanceMiles = 0;

    if (location) {
      const latLng = location.split(',')
      distanceKm = getDistanceFromLatLonInKm(latitude, longitude, latLng[0], latLng[1])
      distanceMiles = distanceKm * 0.621371
    }
    const isCreditCard = offer.feedType === EXCHANGE_FEED_TYPE.INSTANT;

    return (
      <div className="feed-me-exchange">
        <div className="mb-1">
          <span style={{ color: '#C8C7CC' }}>{from}</span> <span style={{ color: '#666666' }}>{email}</span>
          <span className="float-right" style={{ color: '#4CD964' }}>{statusText}</span>
        </div>
        <Feed
          className="feed text-white"
          // background={`${mode === 'discover' ? '#FF2D55' : '#50E3C2'}`}
          background="linear-gradient(-225deg, #EE69FF 0%, #955AF9 100%)"
        >
          <div className="d-flex mb-4">
            <div className="headline">{message}</div>
            {
              !isCreditCard && showChat && (
                <div className="ml-auto pl-2 pt-2" style={{ width: '50px' }}>                {/* to-do chat link */}
                  <Link to={`${URL.HANDSHAKE_CHAT_INDEX}/${chatUsername}`}>
                    <img src={iconChat} width='35px' />
                  </Link>
                </div>
              )
            }

          </div>

          <div className="mb-1 name-shop">{nameShop}</div>
          {/*
          {
            phone && phone.split('-')[1] !== '' && ( // no phone number
              <div className="media mb-1 detail">
                <img className="mr-2" src={iconPhone} width={20}/>
                <div className="media-body">
                  <div><a href={`tel:${phoneDisplayed}`} className="text-white">{phoneDisplayed}</a></div>
                </div>
              </div>
            )
          }

          <div className="media mb-1 detail">
            <img className="mr-2" src={iconLocation} width={20}/>
            <div className="media-body">
              <div>{address}</div>
            </div>
          </div>
          */}

          {
            !isCreditCard && (
              <div className="media detail">
                <img className="mr-2" src={iconLocation} width={20} />
                <div className="media-body">
                  <div>
                    <FormattedMessage id="offerDistanceContent" values={{
                      // offerType: offer.type === 'buy' ? 'Buyer' : 'Seller',
                      distanceKm: distanceKm > 1 || distanceMiles === 0 ? distanceKm.toFixed(0) : distanceKm.toFixed(3),
                      distanceMiles: distanceMiles === 0 ? distanceKm.toFixed(0) : distanceMiles.toFixed(1),
                    }}/>
                  </div>
                </div>
              </div>
            )
          }
        </Feed>
        {/*<Button block className="mt-2">Accept</Button>*/}
        {actionButtons}
        <ModalDialog onRef={modal => this.modalRef = modal}>
          {modalContent}
        </ModalDialog>
      </div>
    );
  }
}

FeedMe.propTypes = {
  className: PropTypes.string,
  background: PropTypes.string,
};

const mapState = state => ({
  discover: state.discover,
  listOfferPrice: state.exchange.listOfferPrice,
  ipInfo: state.app.ipInfo,
  authProfile: state.auth.profile,
});

const mapDispatch = ({
  shakeOffer,
  closeOffer,
  completeShakedOffer,
  cancelShakedOffer,
  withdrawShakedOffer,
  showAlert,
  updateOfferStatus,
  showLoading,
  hideLoading,

  rejectOfferItem,
  completeOfferItem,
  cancelOfferItem,
  acceptOfferItem,
});

export default injectIntl(connect(mapState, mapDispatch)(FeedMe));
