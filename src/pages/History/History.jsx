import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { fireBaseExchangeDataChange, loadMyHandshakeList, fireBaseBettingChange } from '@/reducers/me/action';
import { API_URL, APP, HANDSHAKE_ID } from '@/constants';
import { injectIntl } from 'react-intl';

// components
import { Link } from 'react-router-dom';
import { Grid, Row, Col } from 'react-bootstrap';
import NoData from '@/components/core/presentation/NoData';

import FeedPromise from '@/components/handshakes/promise/Feed';
import FeedBetting from '@/components/handshakes/betting/Feed';
import FeedExchange from '@/components/handshakes/exchange/Feed/FeedMe';
import FeedSeed from '@/components/handshakes/seed/Feed';
import Image from '@/components/core/presentation/Image';

import ToggleSwitch from '@/components/core/presentation/ToggleSwitch';
// style
import AvatarSVG from '@/assets/images/icon/avatar.svg';
import ShopSVG from '@/assets/images/icon/icons8-shop_filled.svg';
import ExpandArrowSVG from '@/assets/images/icon/expand-arrow.svg';
// import { setOfflineStatus } from '@/reducers/auth/action';
import local from '@/services/localStore';
import {Label} from 'semantic-ui-react';
import Helper from '@/services/helper';
import './History.scss';


const TAG = "History";

class History extends React.Component {
  static propTypes = {
    app: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    me: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    
  }

  constructor(props) {
    super(props);
    console.log(TAG ,'- contructor - init');
    this.state = {
      auth: props.auth||{},
    };
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {};
  }

  componentDidMount() {

  }

  

  render() {
    return ( 
        <div><Label>History</Label></div>
    );
  }
}

const mapState = state => ({
  me: state.me,
  app: state.app,
  auth: state.auth,
});

const mapDispatch = ({
  // loadDataset,
});

export default injectIntl(connect(mapState, mapDispatch)(History));