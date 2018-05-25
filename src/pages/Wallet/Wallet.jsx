import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
// service, constant
import { load } from '@/reducers/discover/action';
// components
import { Grid, Row, Col } from 'react-bootstrap';
import Button from '@/components/core/controls/Button';
import { handShakeList } from '@/data/shake.js';
import {WalletModel} from '@/models/Wallet' 
import {Bitcoin} from '@/models/Bitcoin.1.js' 
import {Ethereum} from '@/models/Ethereum.js' 
import dontIcon from '@/assets/images/icon/3-dot-icon.svg';
import iconSafe from '@/assets/images/icon/icon-safe.svg';
import iconWarning from '@/assets/images/icon/icon-warning.svg';

// style
import './Wallet.scss';

class Wallet extends React.Component {
  constructor(props) {    
    super(props);
  }

  async getListBalace() {
    var btcTestnet = new Bitcoin(Bitcoin.Network.Testnet);
    var balance = await btcTestnet.getBalance("n1MZwXhWs1unyuG6qNbEZRZV4qjzd3ZMyz");
    console.log("btcTestnet", balance);

    var ethRinkeby = new Ethereum (Ethereum.Network.Rinkeby);
    balance = await ethRinkeby.getBalance("0xe70adf9aE4d5F68E80A8E2C5EA3B916Dd49C6D87");
    console.log("ethRinkeby", balance);
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
    this.getListBalace();
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
  
});

export default connect(mapState, mapDispatch)(Wallet);
