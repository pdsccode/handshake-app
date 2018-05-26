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
import Header from './Header'; 
import WalletItem from './WalletItem'; 

// style
import './Wallet.scss';

class Wallet extends React.Component {
  constructor(props) { 
    
    super(props);
    this.state = {
      data: {},
      isLoading: false,
      error: null,
      listMainWalletBalance: [],
      listTestWalletBalance: [],
    };
  }

  async componentDidMount() {
    // WalletModel.createMasterWallet();
  
    var listWalletBalance = await this.getListBalace(); 
  
    let listMainWallet = [];
    let listTestWallet = [];

    listWalletBalance.forEach(wallet => {
      // is Mainnet
      if ([Ethereum.Network.Mainnet, Bitcoin.Network.Mainnet].indexOf(wallet.network) > -1){
        listMainWallet.push(wallet);
      }
      else{
        // is Testnet
        listTestWallet.push(wallet);
      }
    });
    this.setState({isLoading: true, listMainWalletBalance: listMainWallet, listTestWalletBalance: listTestWallet});
    
  }

  async getListBalace() {

    let listWallet = WalletModel.getMasterWallet();     

    listWallet.forEach(async wallet => {      

      if (wallet.coinType == WalletModel.CoinType.Ether){
        // Get balance for 2 network: Mainnet + Rinkeby
        for (var network in Ethereum.Network){                     
          let ethereum = new Ethereum (Ethereum.Network[network]);
          wallet.balance = await ethereum.getBalance(wallet.address);            
        }
        
        // Get balance for bitcoin Mainnet + Testnet:
        if ([WalletModel.CoinType.Bitcoin, WalletModel.CoinType.BitcoinTestnet].indexOf(wallet.coinType) > -1){
          let btc = new Bitcoin (Bitcoin.Network[network]);
          wallet.balance = await btc.getBalance(wallet.address);  
          
        }        
        console.log("wallet address ", wallet.address);
      }
    });
    return listWallet;

    // var btcTestnet = new Bitcoin(Bitcoin.Network.Testnet);
    // var balance = await btcTestnet.getBalance("n1MZwXhWs1unyuG6qNbEZRZV4qjzd3ZMyz");
    // console.log("btcTestnet", balance);

    // var ethRinkeby = new Ethereum (Ethereum.Network.Rinkeby);
    // balance = await ethRinkeby.getBalance("0xe70adf9aE4d5F68E80A8E2C5EA3B916Dd49C6D87");
    // console.log("ethRinkeby", balance);
  } 


  get mainWalletBalanceHtml() {
    return this.state.listMainWalletBalance.map(wallet => ( 
      <WalletItem wallet={wallet} onMoreClick={() => this.onMoreClick(wallet)} onWarningClick={() => this.onWarningClick(wallet)} />
    ));
  }
  get testWalletBalanceHtml() {
    return this.state.listTestWalletBalance.map(wallet => ( 
      <WalletItem wallet={wallet} onMoreClick={() => this.onMoreClick(wallet)} onWarningClick={() => this.onWarningClick(wallet)} />
    ));
  }

  onLinkClick (){
      alert("con ga");
  }

  onMoreClick = (wallet) => {
    alert("onMoreClick ->" + wallet.address);
  }
  onWarningClick = (wallet) => {
    alert("onWarningClick ->" + wallet.address);
  }
  
  render() {   
    
    if (!this.state.isLoading){
      return (<Grid></Grid>);
    }

    return (
          
      <Grid>      
        <Row className="list">
          <Header title="Main net wallets" hasLink={true} linkTitle="+ Add new" onLinkClick={this.onLinkClick} />
        </Row>
        <Row className="list">
          {this.mainWalletBalanceHtml}
        </Row>
        <Row className="list">
          <Header title="Test net wallet" hasLink={false} />
        </Row>
        <Row className="list">
          {this.testWalletBalanceHtml}
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
