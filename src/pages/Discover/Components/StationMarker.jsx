import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { FormattedHTMLMessage, FormattedMessage, injectIntl } from 'react-intl';
import {
  URL,
} from '@/constants';
import { Marker, InfoWindow } from "react-google-maps";
import InfoBox from "react-google-maps/lib/components/addons/InfoBox";
import StarsRating from '@/components/core/presentation/StarsRating';

import iconCustomMarker from '@/assets/images/icon/custom-marker.svg';
import './StationMarker.scss'

class StationMarker extends React.Component {

  state = {
    isMarkerShown: false,
  }

  render() {
    const { coordinate, info: { name, rating } } = this.props;
    const { isMarkerShown } = this.state;
    return (
      <Marker
        defaultIcon={{ url: iconCustomMarker, scaledSize: { width: 40, height: 40 } }}
        position={coordinate}
        onClick={() => this.setState({ isMarkerShown: true })}
      >
        {isMarkerShown && (
          <InfoBox
            onCloseClick={() => this.setState({ isMarkerShown: false })}
            options={{
              alignBottom: true,
              pane: 'floatPane',
              pixelOffset: new google.maps.Size(-103, -53),
              boxClass: 'stationInfoWrapper',
              // closeBoxURL: ``,
              enableEventPropagation: true
            }}
          >
            <div className="stationInfo">
              <div>
                <div className="s-name">{name}</div>
                <div><StarsRating className="d-inline-block" starPoint={3.5} startNum={5} /></div>
              </div>
              <hr />
              <div>
                <div className="s-label">Price</div>
                <div className="s-value">
                  <span className="text-success">150,688,303 VND/</span>
                  <span>BTC</span>
                </div>

                <div className="s-label mt-1">Max volume</div>
                <div className="s-value">
                  <span>0.989988 BTC</span>
                </div>
              </div>
              <div className="mt-2">
                <button className="btn btn-primary btn-block" onClick={() => console.log('ahihi')}>Trade now</button>
              </div>
            </div>
          </InfoBox>
        )}
      </Marker>
    );
  }
}

const mapState = state => ({
});

const mapDispatch = dispatch => ({
  // rfChange: bindActionCreators(change, dispatch),
});

export default injectIntl(connect(mapState, mapDispatch)(StationMarker));
