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
    showAllDetails: false,
  }

  handleToggleShowAllDetails = () => {
    this.setState({ showAllDetails: !this.state.showAllDetails })
  }

  render() {
    const { coordinate, info: { name, rating } } = this.props;
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
              zIndex: showAllDetails ? 2 : 1
            },
            closeBoxURL: '',
            enableEventPropagation: true
          }}
        >
          <div className="stationInfo">
            {
              showAllDetails ? (
                <React.Fragment>
                  <div>
                    <div className="info-div">
                      <div className="s-name">{name}</div>
                      <div><StarsRating className="d-inline-block" starPoint={3.5} startNum={5} /></div>
                    </div>
                    <div>
                      <button className="btn btn-sm bg-transparent btn-close" onClick={() => this.setState({ showAllDetails: false })}>&times;</button>
                    </div>
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
                </React.Fragment>
              ) : (
                <div className="s-value" onClick={this.handleToggleShowAllDetails}>
                  <span className="text-success">150,688,303 VND/</span>
                  <span>BTC</span>
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
});

const mapDispatch = dispatch => ({
  // rfChange: bindActionCreators(change, dispatch),
});

export default injectIntl(connect(mapState, mapDispatch)(StationMarker));
