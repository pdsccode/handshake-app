import React from 'react';
import PropTypes from 'prop-types';
import iconLocation from '@/assets/images/icon/icons8-geo_fence.svg';
import iconTransaction from '@/assets/images/icon/icons8-transfer_between_users.svg';
import iconPhone from '@/assets/images/icon/icons8-phone.svg';
import iconChat from '@/assets/images/icon/icons8-chat.svg';
import iconBitcoin from '@/assets/images/icon/coin/btc.svg';
import iconEthereum from '@/assets/images/icon/coin/eth.svg';
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
import ShakeDetail from '../components/ShakeDetail';
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

class FeedExchange extends React.PureComponent {
  constructor(props) {
    super(props);

    // const { extraData } = props;
    // const offer = Offer.offer(JSON.parse(extraData));
    // this.offer = offer;
    this.state = {
      modalContent: '',
    };

    this.mainColor = 'linear-gradient(-180deg, rgba(0,0,0,0.50) 0%, #303030 0%, #000000 100%)'
  }

  handleOnShake = () => {
    this.modalRef.open();
  }

  addOfferItem = () => {
    const { offer } = this.props;
    const offerItem = {
      currency: '',
      sell_amount: '',
      sell_percentage: '',
      buy_amount: '',
      buy_percentage: '',
      user_address: '',
      reward_address: '',
    };

    this.showLoading();
    this.props.addOfferItem({
      PATH_URL: `${API_URL.EXCHANGE.OFFER_STORES}/${offer.id}`,
      METHOD: 'POST',
      data: offerShake,
      successFn: this.handleAddOfferItemSuccess,
      errorFn: this.handleAddOfferItemFailed,
    });
  }

  handleAddOfferItemSuccess = (responseData) => {
    const { intl } = this.props;
    const { data } = responseData;
    const { currency } = data;

    // const offer = this.offer;
    // if (currency === CRYPTO_CURRENCY.ETH) {
    //   this.handleCallActionOnContract(data);
    // } else if (currency === CRYPTO_CURRENCY.BTC) {
    //   if (offer.type === EXCHANGE_ACTION.BUY) {
    //     const wallet = MasterWallet.getWalletDefault(offer.currency);
    //     wallet.transfer(offer.systemAddress, offer.totalAmount).then(success => {
    //       console.log('transfer', success);
    //     });
    //   }
    // }

    this.hideLoading();
    const message = intl.formatMessage({ id: 'addOfferItemSuccessMassage' }, {
      // offerType: offerType,
      // amount: formatAmountCurrency(offer.amount),
      // currency: offer.currency,
      // currency_symbol: offer.fiatCurrency,
      // total: formatMoney(fiatAmount),
      // fee: offer.feePercentage,
      // payment_method: EXCHANGE_METHOD_PAYMENT[EXCHANGE_FEED_TYPE.EXCHANGE],
    });

    this.props.showAlert({
      message: <div className="text-center">{message}</div>,
      timeOut: 2000,
      type: 'success',
      callBack: () => {
        // this.props.updateOfferStatus({ [`exchange_${data.id}`]: data });
        // this.props.history.push(URL.HANDSHAKE_ME);
      },
    });
  }

  handleAddOfferItemFailed = (e) => {
    this.handleActionFailed(e);
  }

  ////////////////////////

  deleteOfferItem = () => {
    const { offer } = this.props;

    this.showLoading();
    this.props.deleteOfferItem({
      PATH_URL: `${API_URL.EXCHANGE.OFFER_STORES}/${offer.id}`,
      METHOD: 'DELETE',
      qs: { currency: CRYPTO_CURRENCY.ETH},
      successFn: this.handleDeleteOfferItemSuccess,
      errorFn: this.handleDeleteOfferItemFailed,
    });
  }

  handleDeleteOfferItemSuccess = (responseData) => {
    const { intl } = this.props;
    const { data } = responseData;
    const { currency } = data;

    // const offer = this.offer;
    // if (currency === CRYPTO_CURRENCY.ETH) {
    //   this.handleCallActionOnContract(data);
    // } else if (currency === CRYPTO_CURRENCY.BTC) {
    //   if (offer.type === EXCHANGE_ACTION.BUY) {
    //     const wallet = MasterWallet.getWalletDefault(offer.currency);
    //     wallet.transfer(offer.systemAddress, offer.totalAmount).then(success => {
    //       console.log('transfer', success);
    //     });
    //   }
    // }

    this.hideLoading();
    const message = intl.formatMessage({ id: 'deleteOfferItemSuccessMassage' }, {
      // offerType: offerType,
      // amount: formatAmountCurrency(offer.amount),
      // currency: offer.currency,
      // currency_symbol: offer.fiatCurrency,
      // total: formatMoney(fiatAmount),
      // fee: offer.feePercentage,
      // payment_method: EXCHANGE_METHOD_PAYMENT[EXCHANGE_FEED_TYPE.EXCHANGE],
    });

    this.props.showAlert({
      message: <div className="text-center">{message}</div>,
      timeOut: 2000,
      type: 'success',
      callBack: () => {
        // this.props.updateOfferStatus({ [`exchange_${data.id}`]: data });
        // this.props.history.push(URL.HANDSHAKE_ME);
      },
    });
  }

  handleDeleteOfferItemFailed = (e) => {
    this.handleActionFailed(e);
  }

  ////////////////////////

  shakeOfferItem = () => {
    const { offer } = this.props;

    const offerItem = {
      type: 'buy',
      currency: 'ETH',
      amount: '',
      username: '',
      email: '',
      contact_phone: '',
      user_address: '',
    };

    this.showLoading();
    this.props.shakeOfferItem({
      PATH_URL: `${API_URL.EXCHANGE.OFFER_STORES}/${offer.id}/${API_URL.EXCHANGE.SHAKES}`,
      METHOD: 'POST',
      successFn: this.handleShakeOfferItemSuccess,
      errorFn: this.handleShakeOfferItemFailed,
    });
  }

  handleShakeOfferItemSuccess = (responseData) => {
    const { intl } = this.props;
    const { data } = responseData;
    const { currency } = data;

    // const offer = this.offer;
    // if (currency === CRYPTO_CURRENCY.ETH) {
    //   this.handleCallActionOnContract(data);
    // } else if (currency === CRYPTO_CURRENCY.BTC) {
    //   if (offer.type === EXCHANGE_ACTION.BUY) {
    //     const wallet = MasterWallet.getWalletDefault(offer.currency);
    //     wallet.transfer(offer.systemAddress, offer.totalAmount).then(success => {
    //       console.log('transfer', success);
    //     });
    //   }
    // }

    this.hideLoading();
    const message = intl.formatMessage({ id: 'shakeOfferItemSuccessMassage' }, {
      // offerType: offerType,
      // amount: formatAmountCurrency(offer.amount),
      // currency: offer.currency,
      // currency_symbol: offer.fiatCurrency,
      // total: formatMoney(fiatAmount),
      // fee: offer.feePercentage,
      // payment_method: EXCHANGE_METHOD_PAYMENT[EXCHANGE_FEED_TYPE.EXCHANGE],
    });

    this.props.showAlert({
      message: <div className="text-center">{message}</div>,
      timeOut: 2000,
      type: 'success',
      callBack: () => {
        // this.props.updateOfferStatus({ [`exchange_${data.id}`]: data });
        // this.props.history.push(URL.HANDSHAKE_ME);
      },
    });
  }

  handleShakeOfferItemFailed = (e) => {
    this.handleActionFailed(e);
  }

  ////////////////////////

  rejectOfferItem = () => {
    const { offer, shake } = this.props;

    this.showLoading();
    this.props.rejectOfferItem({
      PATH_URL: `${API_URL.EXCHANGE.OFFER_STORES}/${offer.id}/${API_URL.EXCHANGE.SHAKES}/${shake.id}`,
      METHOD: 'DELETE',
      successFn: this.handleRejectOfferItemSuccess,
      errorFn: this.handleRejectOfferItemFailed,
    });
  }

  handleRejectOfferItemSuccess = (responseData) => {
    const { intl } = this.props;
    const { data } = responseData;
    const { currency } = data;

    // const offer = this.offer;
    // if (currency === CRYPTO_CURRENCY.ETH) {
    //   this.handleCallActionOnContract(data);
    // } else if (currency === CRYPTO_CURRENCY.BTC) {
    //   if (offer.type === EXCHANGE_ACTION.BUY) {
    //     const wallet = MasterWallet.getWalletDefault(offer.currency);
    //     wallet.transfer(offer.systemAddress, offer.totalAmount).then(success => {
    //       console.log('transfer', success);
    //     });
    //   }
    // }

    this.hideLoading();
    const message = intl.formatMessage({ id: 'rejectOfferItemSuccessMassage' }, {
      // offerType: offerType,
      // amount: formatAmountCurrency(offer.amount),
      // currency: offer.currency,
      // currency_symbol: offer.fiatCurrency,
      // total: formatMoney(fiatAmount),
      // fee: offer.feePercentage,
      // payment_method: EXCHANGE_METHOD_PAYMENT[EXCHANGE_FEED_TYPE.EXCHANGE],
    });

    this.props.showAlert({
      message: <div className="text-center">{message}</div>,
      timeOut: 2000,
      type: 'success',
      callBack: () => {
        // this.props.updateOfferStatus({ [`exchange_${data.id}`]: data });
        // this.props.history.push(URL.HANDSHAKE_ME);
      },
    });
  }

  handleRejectOfferItemFailed = (e) => {
    this.handleActionFailed(e);
  }

  ////////////////////////

  completeOfferItem = () => {
    const { offer, shake } = this.props;

    this.showLoading();
    this.props.completeOfferItem({
      PATH_URL: `${API_URL.EXCHANGE.OFFER_STORES}/${offer.id}/${API_URL.EXCHANGE.SHAKES}/${shake.id}`,
      METHOD: 'POST',
      successFn: this.handleCompleteOfferItemSuccess,
      errorFn: this.handleCompleteOfferItemFailed,
    });
  }

  handleCompleteOfferItemSuccess = (responseData) => {
    const { intl } = this.props;
    const { data } = responseData;
    const { currency } = data;

    // const offer = this.offer;
    // if (currency === CRYPTO_CURRENCY.ETH) {
    //   this.handleCallActionOnContract(data);
    // } else if (currency === CRYPTO_CURRENCY.BTC) {
    //   if (offer.type === EXCHANGE_ACTION.BUY) {
    //     const wallet = MasterWallet.getWalletDefault(offer.currency);
    //     wallet.transfer(offer.systemAddress, offer.totalAmount).then(success => {
    //       console.log('transfer', success);
    //     });
    //   }
    // }

    this.hideLoading();
    const message = intl.formatMessage({ id: 'completeOfferItemSuccessMassage' }, {
      // offerType: offerType,
      // amount: formatAmountCurrency(offer.amount),
      // currency: offer.currency,
      // currency_symbol: offer.fiatCurrency,
      // total: formatMoney(fiatAmount),
      // fee: offer.feePercentage,
      // payment_method: EXCHANGE_METHOD_PAYMENT[EXCHANGE_FEED_TYPE.EXCHANGE],
    });

    this.props.showAlert({
      message: <div className="text-center">{message}</div>,
      timeOut: 2000,
      type: 'success',
      callBack: () => {
        // this.props.updateOfferStatus({ [`exchange_${data.id}`]: data });
        // this.props.history.push(URL.HANDSHAKE_ME);
      },
    });
  }

  handleCompleteOfferItemFailed = (e) => {
    this.handleActionFailed(e);
  }

  render() {
    const nameShop = 'CryptoWorkshop'
    const currency = 'USD'
    const success = 60
    const fail = 60
    const distance = '800 meters (30 miles) away'
    return (
      <div className="feed-exchange">
        <Feed
          className="feed"
          background={this.mainColor}
        >
          <div className="info">
            <div className="name-shop">{nameShop}</div>
            <div className="transaction">Successful ({success}) - Failed ({fail})</div>
            <div className="distance">{distance}</div>
          </div>
          <table className="table-ex">
            <thead>
              <tr>
                <th></th>
                <th className="buy-color header-text">Buy rate</th>
                <th className="sell-color header-text">Sell rate</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><div className="image"><img src={iconBitcoin} /></div></td>
                <td>
                  <div className="buy-color price-number">10000</div>
                  <div className="currency">{currency}</div>
                </td>
                <td>
                  <div className="sell-color price-number">8000</div>
                  <div className="currency">{currency}</div>
                </td>
              </tr>
              <tr>
                <td><div className="image"><img src={iconEthereum} className="icon" /></div></td>
                <td>
                  <div className="buy-color price-number">625</div>
                  <div className="currency">{currency}</div>
                </td>
                <td>
                  <div className="sell-color price-number">615</div>
                  <div className="currency">{currency}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </Feed>
        <Button block className="mt-2" onClick={this.handleOnShake}>Shake</Button>
        <ModalDialog onRef={modal => this.modalRef = modal} className="dialog-shake-detail">
          <ShakeDetail />
        </ModalDialog>
      </div>
    );
  }
}

FeedExchange.propTypes = {
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
});

export default injectIntl(connect(mapState, mapDispatch)(FeedExchange));
