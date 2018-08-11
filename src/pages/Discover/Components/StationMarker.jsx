import React from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { EXCHANGE_ACTION, } from '@/constants';
import { Marker } from 'react-google-maps';
import InfoBox from 'react-google-maps/lib/components/addons/InfoBox';
import StarsRating from '@/components/core/presentation/StarsRating';

import iconCustomMarker from '@/assets/images/icon/custom-marker.svg';
import './StationMarker.scss';
import OfferShop from '@/models/OfferShop';
import { formatMoneyByLocale, getOfferPrice } from '@/services/offer-util';

class StationMarker extends React.Component {
  constructor(props) {
    super(props);

    const { extraData } = this.props;

    this.offer = OfferShop.offerShop(JSON.parse(extraData));

    this.state = {
      showAllDetails: false,
    };
  }

  handleToggleShowAllDetails = () => {
    this.setState({ showAllDetails: !this.state.showAllDetails });
  }

  getPrice = () => {
    const { listOfferPrice, actionActive, currencyActive } = this.props;
    const { fiatCurrency } = this.offer;
    const item = this.offer.items[currencyActive];
    const offerPrice = getOfferPrice(listOfferPrice, actionActive, currencyActive, fiatCurrency);
    const price = offerPrice.price * (1 + (actionActive === EXCHANGE_ACTION.BUY ? item?.buyPercentage : item?.sellPercentage) / 100) || 0;

    return price;
  }

  getVolume = () => {
    const { actionActive, currencyActive } = this.props;
    const item = this.offer.items[currencyActive];

    return actionActive === EXCHANGE_ACTION.BUY ? item?.buyAmount || 0 : item?.sellAmount || 0;
  }

  render() {
    const { messages } = this.props.intl;
    const { actionActive, currencyActive, location } = this.props;
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
                      <span className="text-success">{`${formatMoneyByLocale(price, fiatCurrency)} ${fiatCurrency}/`}</span>
                      <span>{currencyActive}</span>
                    </div>

                    <div className="s-label mt-1">{messages.discover.feed.cash.marker.label.maxVolume}</div>
                    <div className="s-value">
                      <span>{`${maxVolume} ${currencyActive}`}</span>
                    </div>
                  </div>
                  <div className="mt-2">
                    <button className="btn btn-primary btn-block" onClick={() => console.log('ahihi')}>{messages.discover.feed.cash.marker.label.tradeNow}</button>
                  </div>
                </React.Fragment>
              ) : (
                <div className="s-value" onClick={this.handleToggleShowAllDetails}>
                  <span className="text-success">{`${formatMoneyByLocale(price, fiatCurrency)} ${fiatCurrency}/`}</span>
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
});

const mapDispatch = dispatch => ({
  // rfChange: bindActionCreators(change, dispatch),
});

export default injectIntl(connect(mapState, mapDispatch)(StationMarker));
