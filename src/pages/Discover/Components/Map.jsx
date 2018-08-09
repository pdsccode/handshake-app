import React from 'react';
import { withScriptjs, withGoogleMap, GoogleMap } from "react-google-maps";

import StationMarker from './StationMarker';
import './Map.scss';
import { injectIntl } from 'react-intl'
import { connect } from 'react-redux'

import iconCurrentLocation from '@/assets/images/icon/current-location.svg';


class Map extends React.Component {
  state = {
    center: { lat: 35.929673, lng: -78.948237 }
  }

  handleGoToCurrentLocation = () => {
    const currentLocation = { lat: 10.808881, lng: 106.659626 };
    this.setState({ center: currentLocation });
  }

  render() {
    const { isMarkerShown, onMarkerClick } = this.props;
    const { center } = this.state;

    const stations = [
      {
        id: 1,
        coordinate: { lat: 35.929673, lng: -78.948237 },
        info: {
          name: 'Leon S Kennedy',
          rating: 3.4
        }
      },
      {
        id: 2,
        coordinate: { lat: 38.889510, lng: -77.032000 },
        info: {
          name: 'Leon S Kennedy 1111',
          rating: 4.4
        }
      },
    ]
    return (
      <GoogleMap
        defaultZoom={6}
        center={center}
      >
        {
          stations.map((station) => {
            const { id, ...rest } = station;
            return (
              <StationMarker key={id} {...rest} />
            )
          })
        }
        <button className="btn-current-location" onClick={this.handleGoToCurrentLocation}>
          <img src={iconCurrentLocation} />
        </button>
      </GoogleMap>
    )
  }
}

const mapState = state => ({
});

const mapDispatch = dispatch => ({
  // rfChange: bindActionCreators(change, dispatch),
});

export default injectIntl(connect(mapState, mapDispatch)(withScriptjs(withGoogleMap(Map))));

