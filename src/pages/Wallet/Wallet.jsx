import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// service, constant
import { load } from '@/reducers/discover/action';
// components
import { Grid, Row, Col } from 'react-bootstrap';
import Button from '@/components/core/controls/Button';
import { handShakeList } from '@/data/shake.js';
import {WalletModel} from '../../models/Wallet'
import dontIcon from '@/assets/images/icon/3-dot-icon.svg';
import iconSafe from '@/assets/images/icon/icon-safe.svg';
import iconWarning from '@/assets/images/icon/icon-warning.svg';

// style
import './Wallet.scss';


class Wallet extends React.Component {
  constructor(props) {    
    super(props);
  }

  getBalace() {
    
  }

  get feedHtml() {
    return handShakeList.data.map(handShake => (
      <Col sm={6} md={6} xs={6} key={handShake.id} className="feed-wrapper">
        <div className="feed eth-wallet-bg">
          
          <p className="name">{"Bitcoin"}</p>
          <p className="balance"> 12 BTC </p>
          <img className="more" src={dontIcon} />          
          <img className="safe" src={iconWarning} />          
          <p className="address">{"0x397823..."}</p>
        </div>        
      </Col>
    ));
  }

  render() {
    return (
      <Grid>      
        <Row className="list">
          {this.feedHtml}
        </Row>
      </Grid>
    );
  }
}

Wallet.propTypes = {
  discover: PropTypes.object,
  load: PropTypes.func
};

const mapState = (state) => ({
  discover: state.discover,
});

const mapDispatch = ({
  load
});

export default connect(mapState, mapDispatch)(Wallet);
