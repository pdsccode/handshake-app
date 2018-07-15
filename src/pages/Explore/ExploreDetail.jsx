import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
// action, mock
import {
  fireBaseExchangeDataChange,
  loadMyHandshakeList,
  fireBaseBettingChange,
} from '@/reducers/me/action';
import { API_URL, APP, HANDSHAKE_ID, URL } from '@/constants';
import { injectIntl } from 'react-intl';

// components
import { Link } from 'react-router-dom';
import { Grid, Row, Col } from 'react-bootstrap';
import NoData from '@/components/core/presentation/NoData';
import { getListOfferPrice, reviewOffer } from '@/reducers/exchange/action';

// style
import { setOfflineStatus } from '@/reducers/auth/action';
import local from '@/services/localStore';

import Helper from '@/services/helper';

import './Classify.scss';
import DataDetail from '@/pages/Explore/DataDetail';

const TAG = 'ExploreDetail';

class ExploreDetail extends React.Component {
  static propTypes = {
    app: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    // me: PropTypes.object.isRequired,
    // loadMyHandshakeList: PropTypes.func.isRequired,
    // getListOfferPrice: PropTypes.func.isRequired,
    // firebaseUser: PropTypes.any.isRequired,
    // history: PropTypes.object.isRequired,
    // fireBaseExchangeDataChange: PropTypes.func.isRequired,
    // fireBaseBettingChange: PropTypes.func.isRequired,
    // exchange: PropTypes.object.isRequired,
    // setOfflineStatus: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    console.log(TAG, ' - contructor - init');

    const { s, sh } = Helper.getQueryStrings(window.location.search);

    const initUserId = s;
    const offerId = sh;

    this.state = {
      initUserId,
      offerId,
      // exchange: this.props.exchange,
      auth: props.auth,
      // firebaseUser: this.props.firebaseUser,
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.auth.updatedAt !== prevState.auth.updatedAt) {
      return { auth: nextProps.auth };
    }
    return null;
  }

  componentDidMount() {}

  render() {
    return (
      <DataDetail
        {...this.props}
        token={this.props.auth?.dataset_profile?.token || ''}
      />
    );
  }
}

const mapState = state => ({
  app: state.app,
  auth: state.auth,
});

const mapDispatch = {};

export default injectIntl(connect(mapState, mapDispatch)(ExploreDetail));
