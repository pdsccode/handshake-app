import React from 'react';
import { withScriptjs, withGoogleMap, GoogleMap } from 'react-google-maps';

import StationMarker from './StationMarker';
import './Map.scss';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import iconCurrentLocation from '@/assets/images/icon/current-location.svg';
import OfferShop from "../../../models/OfferShop";


class Map extends React.Component {
  constructor(props) {
    super(props);

    const { lat, lng } = this.props;

    this.state = {
      center: { lat, lng },
      zoomLevel: 6,
    };
  }

  handleGoToCurrentLocation = () => {
    const { lat, lng } = this.props;
    this.setState({ center: { lat, lng }, zoomLevel: 18 });
  }

  isEmptyBalance = (item) => {
    if (!item) {
      return;
    }

    const { actionActive } = this.props;
    const { buyAmount, sellAmount } = item;
    if (actionActive.includes('buy')) {
      return sellAmount <= 0;
    }
    return buyAmount <= 0;
  }

  render() {
    const { isMarkerShown, onMarkerClick, stations, actionActive, currencyActive, onFeedClick, modalRef, setLoading } = this.props;
    const { center, zoomLevel } = this.state;

    return (
      <GoogleMap
        zoom={zoomLevel}
        center={center}
      >
        {
          stations && stations.map((station) => {
            const { id, ...rest } = station;
            const offer = OfferShop.offerShop(JSON.parse(station.extraData));
            const allowRender = offer.itemFlags[currencyActive] && !this.isEmptyBalance(offer.items[currencyActive]);

            if (!allowRender) {
              return null;
            } else {
              return (
                <StationMarker key={id} {...rest}
                               actionActive={actionActive}
                               currencyActive={currencyActive}
                               onFeedClick={extraData => onFeedClick(station, extraData)}
                               offer={offer}
                               modalRef={modalRef}
                               setLoading={setLoading}
                />
              );
            }
          })
        }
        <button className="btn-current-location" onClick={this.handleGoToCurrentLocation}>
          <img src={iconCurrentLocation} />
        </button>
      </GoogleMap>
    );
  }
}

const mapState = state => ({
});

const mapDispatch = dispatch => ({
  // rfChange: bindActionCreators(change, dispatch),
});

export default injectIntl(connect(mapState, mapDispatch)(withScriptjs(withGoogleMap(Map))));

