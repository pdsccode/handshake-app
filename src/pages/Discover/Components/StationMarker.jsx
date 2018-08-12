import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { CRYPTO_CURRENCY, EXCHANGE_ACTION } from '@/constants';
import { Marker } from 'react-google-maps';
import InfoBox from 'react-google-maps/lib/components/addons/InfoBox';
import StarsRating from '@/components/core/presentation/StarsRating';

import iconCustomMarker from '@/assets/images/icon/custom-marker.svg';
import './StationMarker.scss';
import OfferShop from '@/models/OfferShop';
import { formatMoneyByLocale, getOfferPrice } from '@/services/offer-util';
import ShakeDetail, { nameFormShakeDetail } from '@/components/handshakes/exchange/components/ShakeDetail';
import { change, clearFields } from 'redux-form';
import { bindActionCreators } from 'redux';

import iconBitcoin from '@/assets/images/icon/coin/btc.svg';
import iconEthereum from '@/assets/images/icon/coin/eth.svg';

const ICONS = {
  [CRYPTO_CURRENCY.ETH]: iconEthereum,
  [CRYPTO_CURRENCY.BTC]: iconBitcoin,
};

class StationMarker extends React.Component {
  constructor(props) {
    super(props);

    const { extraData } = this.props;

    this.offer = OfferShop.offerShop(JSON.parse(extraData));

    const cryptoCurrencyList = Object.values(CRYPTO_CURRENCY).map(item => ({
      value: item, text: item, icon: <img src={ICONS[item]} width={22} />, hide: false,
    }));

    this.state = {
      showAllDetails: false,
      CRYPTO_CURRENCY_LIST: cryptoCurrencyList,
    };
  }

  handleToggleShowAllDetails = () => {
    this.setState({ showAllDetails: !this.state.showAllDetails });
  }

  getPrice = () => {
    const { listOfferPrice, actionActive, currencyActive } = this.props;
    const { fiatCurrency } = this.offer;
    const item = this.offer.items[currencyActive];
    const offerPrice = getOfferPrice(listOfferPrice, actionActive === EXCHANGE_ACTION.BUY ? EXCHANGE_ACTION.SELL : EXCHANGE_ACTION.BUY, currencyActive, fiatCurrency);
    const price = offerPrice.price * (1 + (actionActive === EXCHANGE_ACTION.BUY ? item?.sellPercentage : item?.buyPercentage) / 100) || 0;

    return price;
  }

  getVolume = () => {
    const { actionActive, currencyActive } = this.props;
    const item = this.offer.items[currencyActive];

    return actionActive === EXCHANGE_ACTION.BUY ? item?.sellAmount || 0 : item?.buyAmount || 0;
  }

  isEmptyBalance = (item) => {
    const { buyAmount, sellAmount } = item;
    return !(buyAmount > 0 || sellAmount > 0);
  }

  handleOnShake = () => {
    const { offer } = this;
    const { onFeedClick, actionActive, currencyActive } = this.props;

    const cryptoCurrencyList = Object.values(CRYPTO_CURRENCY).map(currency => ({
      value: currency, text: currency, icon: <img src={ICONS[currency]} width={22} />, hide: !offer.itemFlags[currency] || this.isEmptyBalance(offer.items[currency]),
    }));

    this.setState({
      CRYPTO_CURRENCY_LIST: cryptoCurrencyList,
    }, () => {
      onFeedClick({
        modalClassName: 'dialog-shake-detail',
        modalContent: (
          <ShakeDetail offer={this.offer} handleShake={this.shakeOfferItem} CRYPTO_CURRENCY_LIST={this.state.CRYPTO_CURRENCY_LIST} />
        ),
      });
      setTimeout(() => {
        this.props.rfChange(nameFormShakeDetail, 'currency', currencyActive);
        this.props.rfChange(nameFormShakeDetail, 'type', actionActive);

        this.props.clearFields(nameFormShakeDetail, false, false, 'amount', 'amountFiat');
      }, 100);
    });
  }

  render() {
    const { messages } = this.props.intl;
    const {
      actionActive, currencyActive, location, initUserId, authProfile,
    } = this.props;
    const { username, review, fiatCurrency } = this.offer;
    const locationArr = location.split(',');
    const coordinate = { lat: parseFloat(locationArr[0]), lng: parseFloat(locationArr[1]) };
    const price = this.getPrice();
    const maxVolume = this.getVolume();
    const { showAllDetails } = this.state;
    return (
      <Marker
        defaultIcon={{ url: iconCustomMarker, scaledSize: { width: 40, height: 40 } }}
        position={coordinate}
        onClick={this.handleToggleShowAllDetails}
      >
        <InfoBox
          onCloseClick={() => this.setState({ showAllDetails: false })}
          options={{
            alignBottom: true,
            pane: 'floatPane',
            pixelOffset: new google.maps.Size(-103, -46),
            boxClass: 'stationInfoWrapper',
            boxStyle: {
              zIndex: showAllDetails ? 2 : 1,
            },
            closeBoxURL: '',
            enableEventPropagation: true,
          }}
        >
          <div className="stationInfo">
            {
              showAllDetails ? (
                <React.Fragment>
                  <div>
                    <div className="info-div">
                      <div className="s-name">{username}</div>
                      <div><StarsRating className="d-inline-block" starPoint={review} startNum={5} /></div>
                    </div>
                    <div>
                      <button className="btn btn-sm bg-transparent btn-close" onClick={() => this.setState({ showAllDetails: false })}>&times;</button>
                    </div>
                  </div>
                  <hr />
                  <div>
                    <div className="s-label">{messages.discover.feed.cash.marker.label.price}</div>
                    <div className="s-value">
                      <span className={`${actionActive === EXCHANGE_ACTION.BUY ? 'buy-price' : 'sell-price'}`}>{`${formatMoneyByLocale(price, fiatCurrency)} ${fiatCurrency}/`}</span>
                      <span>{currencyActive}</span>
                    </div>

                    <div className="s-label mt-1">{messages.discover.feed.cash.marker.label.maxVolume}</div>
                    <div className="s-value">
                      <span>{`${maxVolume} ${currencyActive}`}</span>
                    </div>
                  </div>
                  {initUserId !== authProfile?.id && (
                    <div className="mt-2">
                      <button
                        className="btn btn-primary btn-block"
                        onClick={this.handleOnShake}
                      >{messages.discover.feed.cash.marker.label.tradeNow}
                      </button>
                    </div>
                  )}
                </React.Fragment>
              ) : (
                <div className="s-value" onClick={this.handleToggleShowAllDetails}>
                  <span className={`${actionActive === EXCHANGE_ACTION.BUY ? 'buy-price' : 'sell-price'}`}>{`${formatMoneyByLocale(price, fiatCurrency)} ${fiatCurrency}/`}</span>
                  <span>{currencyActive}</span>
                </div>
              )
            }
          </div>
        </InfoBox>
      </Marker>
    );
  }
}

const mapState = state => ({
  listOfferPrice: state.exchange.listOfferPrice,
  authProfile: state.auth.profile,
});

const mapDispatch = dispatch => ({
  rfChange: bindActionCreators(change, dispatch),
  clearFields: bindActionCreators(clearFields, dispatch),
});

export default injectIntl(connect(mapState, mapDispatch)(StationMarker));
