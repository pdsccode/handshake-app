import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { FormattedHTMLMessage, FormattedMessage, injectIntl } from 'react-intl';
// service, constant
// import { loadDiscoverList } from '@/reducers/discover/action';
import {
  URL,
} from '@/constants';
import { Link } from 'react-router-dom';
// import Cookies from 'js-cookie';
import Helper from '@/services/helper';

// components
// import SearchBar from '@/components/core/controls/SearchBar';
import ModalDialog from '@/components/core/controls/ModalDialog';

// import FeedPromise from '@/components/handshakes/promise/Feed';
// import FeedBetting from '@/components/handshakes/betting/Feed';
import FeedExchange from '@/components/handshakes/exchange/Feed/FeedExchange';
// import FeedExchangeLocal from '@/components/handshakes/exchange/Feed/FeedExchangeLocal';
// import FeedSeed from '@/components/handshakes/seed/Feed';
import { fieldDropdown, fieldRadioButton } from '@/components/core/form/customField';
import { change, Field } from 'redux-form';
import Map from './Components/Map';
import NavBar from './Components/NavBar';
import Footer from './Components/Footer';

class DiscoverPage extends React.Component {

  state = {
    isMarkerShown: false,
  }

  componentDidMount() {
    this.delayedShowMarker()
  }

  delayedShowMarker = () => {
    setTimeout(() => {
      this.setState({ isMarkerShown: true })
    }, 3000)
  }

  handleMarkerClick = () => {
    this.setState({ isMarkerShown: false })
    this.delayedShowMarker()
  }

  render() {

    return (
      <div>
        <NavBar />
        <Map
          isMarkerShown={this.state.isMarkerShown}
          onMarkerClick={this.handleMarkerClick}
          // googleMapURL="https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places"
          googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.GOOGLE_API_KEY}`}
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `calc(100vh - 48px - 55px)`, marginTop: '48px' }} />}
          mapElement={<div style={{ height: `100%` }} />}
          center={{ lat: 35.929673, lng: -78.948237 }}
        />
        <Footer />
      </div>
    );
  }
}

const mapState = state => ({
});

const mapDispatch = dispatch => ({
  rfChange: bindActionCreators(change, dispatch),
});

export default injectIntl(connect(mapState, mapDispatch)(DiscoverPage));
