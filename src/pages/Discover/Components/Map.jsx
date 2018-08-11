import React from 'react';
import { withScriptjs, withGoogleMap, GoogleMap } from 'react-google-maps';

import StationMarker from './StationMarker';
import './Map.scss';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';

import iconCurrentLocation from '@/assets/images/icon/current-location.svg';


class Map extends React.Component {
  constructor(props) {
    super(props);

    const { lat, lng } = this.props;

    this.state = {
      center: { lat, lng },
    };
  }

  handleGoToCurrentLocation = () => {
    const { lat, lng } = this.props;
    this.setState({ center: { lat, lng } });
  }

  render() {
    const { isMarkerShown, onMarkerClick, stations, actionActive, currencyActive } = this.props;
    const { center } = this.state;

    return (
      <GoogleMap
        defaultZoom={6}
        center={center}
      >
        {
          stations && stations.map((station) => {
            const { id, ...rest } = station;

            return (
              <StationMarker key={id} {...rest}
                             actionActive={actionActive}
                             currencyActive={currencyActive}
              />
            );
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

