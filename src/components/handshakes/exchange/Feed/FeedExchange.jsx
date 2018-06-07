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
// import {URL} from '@/config';
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
    this.mainColor = 'linear-gradient(-180deg, rgba(0,0,0,0.50) 0%, #303030 0%, #000000 100%)'
  }

  handleOnShake = () => {
    this.modalRef.open();
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
