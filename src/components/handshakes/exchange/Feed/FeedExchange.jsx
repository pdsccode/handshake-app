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
import { shakeOfferItem } from "@/reducers/exchange/action";
import CoinOffer from "@/models/CoinOffer";
import OfferShop from "@/models/OfferShop";

class FeedExchange extends React.PureComponent {
  constructor(props) {
    super(props);

    // const { extraData } = props;
    const extraData = {
      "btc": {
        "currency": "BTC",
        "sell_amount_min": "",
        "sell_amount": "0",
        "sell_balance": "",
        "sell_percentage": "5",
        "buy_amount_min": "",
        "buy_amount": "0",
        "buy_balance": "",
        "buy_percentage": "5",
        "system_address": "",
        "user_address": "xxx",
        "reward_address": "xxx"
      },
      "eth": {
        "currency": "ETH",
        "sell_amount_min": "",
        "sell_amount": "0",
        "sell_balance": "",
        "sell_percentage": "5",
        "buy_amount_min": "",
        "buy_amount": "0",
        "buy_balance": "",
        "buy_percentage": "5",
        "system_address": "",
        "user_address": "xxx",
        "reward_address": "xxx"
      },
      "offer": {
        "id": "",
        "hid": 0,
        "item_flags": null,
        "status": "",
        "username": "abc",
        "email": "abc@mail.com",
        "language": "",
        "contact_phone": "",
        "contact_info": "",
        "longitude": 0,
        "latitude": 0,
        "fiat_currency": "VND",
        "transaction_count": {
          "currency": "",
          "success": 0,
          "failed": 0
        }
      }
    };

    this.offer = OfferShop.offerShop(extraData.offer);
    this.eth = CoinOffer.coinOffer(extraData.eth);
    this.btc = CoinOffer.coinOffer(extraData.btc);

    console.log('extraData', this.offer, this.eth, this.btc);

    this.state = {
      modalContent: '',
    };

    this.mainColor = 'linear-gradient(-180deg, rgba(0,0,0,0.50) 0%, #303030 0%, #000000 100%)'
  }

  handleOnShake = () => {
    this.modalRef.open();
  }


  ////////////////////////

  shakeOfferItem = (values) => {
    this.modalRef.close();

    const { authProfile, offer } = this.props;

    const offerItem = {
      type: values.type,
      currency: values.currency,
      amount: values.amount,
      username: authProfile?.name,
      email: authProfile?.email,
      contact_phone: authProfile?.phone,
      user_address: authProfile?.address,
    };

    this.showLoading();
    this.props.shakeOfferItem({
      PATH_URL: `${API_URL.EXCHANGE.OFFER_STORES}/${offer.id}/${API_URL.EXCHANGE.SHAKES}`,
      METHOD: 'POST',
      successFn: this.handleShakeOfferItemSuccess,
      errorFn: this.handleShakeOfferItemFailed,
    });
  }

  handleShakeOfferItemSuccess = async (responseData) => {
    const { intl } = this.props;
    const { data } = responseData;
    const { currency, type, totalAmount } = data;

    const offer = this.offer;
    if (currency === CRYPTO_CURRENCY.ETH) {
      let amount = 0;
      if (offer.type === EXCHANGE_ACTION.BUY) {
        amount = data.total_amount;
      }

      const wallet = MasterWallet.getWalletDefault(currency);
      const exchangeHandshake = new ExchangeHandshake(wallet.chainId);
      const result = await exchangeHandshake.shake(data.hid, amount, data.id);

      console.log('handleShakeOfferSuccess', result);
    } else if (currency === CRYPTO_CURRENCY.BTC) {
      if (type === EXCHANGE_ACTION.BUY) {
        const wallet = MasterWallet.getWalletDefault(currency);
        wallet.transfer(offer.systemAddress, totalAmount).then(success => {
          console.log('transfer', success);
        });
      }
    }

    this.hideLoading();
    const message = intl.formatMessage({ id: 'shakeOfferItemSuccessMassage' }, {
    });

    this.props.showAlert({
      message: <div className="text-center">{message}</div>,
      timeOut: 2000,
      type: 'success',
      callBack: () => {
      },
    });
  }

  handleShakeOfferItemFailed = (e) => {
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
      }
    });
  }

  getOfferDistance = () => {
    const { intl,  ipInfo: { latitude, longitude } } = this.props;
    let distanceKm = 0;
    let distanceMiles = 0;

    console.log('getOfferDistance', latitude, longitude, this.offer.latitude, this.offer.longitude);

    // if (location) {
    //   const latLng = location.split(',')
      // this.distanceKm = getDistanceFromLatLonInKm(latitude, longitude, latLng[0], latLng[1])
      distanceKm = getDistanceFromLatLonInKm(latitude, longitude, this.offer.latitude || 0, this.offer.longitude || 0);
      distanceMiles = distanceKm * 0.621371;
    // }

    return intl.formatMessage({ id: 'offerDistanceContent' }, {
      distanceKm: distanceKm > 1 || distanceMiles === 0 ? distanceKm.toFixed(0) : distanceKm.toFixed(3),
      distanceMiles: distanceMiles === 0 ? distanceKm.toFixed(0) : distanceMiles.toFixed(1),
    });
  }

  getPrices = () => {
    const { listOfferPrice } = this.props;

    let priceBuyBTC, priceSellBTC, priceBuyETH, priceSellETH;

    if (listOfferPrice) {
      let offerPrice = getOfferPrice(listOfferPrice, EXCHANGE_ACTION.BUY, CRYPTO_CURRENCY.BTC);
      priceBuyBTC = offerPrice.price;

      offerPrice = getOfferPrice(listOfferPrice, EXCHANGE_ACTION.SELL, CRYPTO_CURRENCY.BTC);
      priceSellBTC = offerPrice.price;

      offerPrice = getOfferPrice(listOfferPrice, EXCHANGE_ACTION.BUY, CRYPTO_CURRENCY.ETH);
      priceBuyETH = offerPrice.price;

      offerPrice = getOfferPrice(listOfferPrice, EXCHANGE_ACTION.SELL, CRYPTO_CURRENCY.ETH);
      priceSellETH = offerPrice.price;
    }

    return { priceBuyBTC, priceSellBTC, priceBuyETH, priceSellETH };
  }

  render() {
    const { offer, eth, btc } = this;
    const nameShop = offer.username;
    const currency = offer.fiatCurrency;
    const success = offer.transactionCount.success;
    const failed = offer.transactionCount.failed;

    const distance = this.getOfferDistance();

    const { priceBuyBTC, priceSellBTC, priceBuyETH, priceSellETH } = this.getPrices();

    return (
      <div className="feed-exchange">
        <Feed
          className="feed"
          background={this.mainColor}
        >
          <div className="info">
            <div className="name-shop">{nameShop}</div>
            <div className="transaction">Successful ({success}) - Failed ({failed})</div>
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
                  <div className="buy-color price-number">{priceBuyBTC}</div>
                  <div className="currency">{currency}</div>
                </td>
                <td>
                  <div className="sell-color price-number">{priceSellBTC}</div>
                  <div className="currency">{currency}</div>
                </td>
              </tr>
              <tr>
                <td><div className="image"><img src={iconEthereum} className="icon" /></div></td>
                <td>
                  <div className="buy-color price-number">{priceBuyETH}</div>
                  <div className="currency">{currency}</div>
                </td>
                <td>
                  <div className="sell-color price-number">{priceSellETH}</div>
                  <div className="currency">{currency}</div>
                </td>
              </tr>
            </tbody>
          </table>
        </Feed>
        <Button block className="mt-2" onClick={this.handleOnShake}>Shake</Button>
        <ModalDialog onRef={modal => this.modalRef = modal} className="dialog-shake-detail">
          <ShakeDetail offer={this.offer} eth={this.eth} btc={this.btc} handleShake={this.shakeOfferItem}/>
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
  shakeOfferItem,
  showAlert,
  showLoading,
  hideLoading,
});

export default injectIntl(connect(mapState, mapDispatch)(FeedExchange));
