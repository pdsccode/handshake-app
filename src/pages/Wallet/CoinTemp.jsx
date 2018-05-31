import React from 'react';
import { Col } from 'react-bootstrap';
import {Bitcoin} from '@/models/Bitcoin.js' 
import {Ethereum} from '@/models/Ethereum.js' 
import iconChecked from '@/assets/images/icon/icon-checked-wallet.svg';



import PropTypes from 'prop-types';
import './Wallet.scss';

class CoinTemp extends React.Component {

    isMainnet(wallet){
        return [Ethereum.Network.Mainnet, Bitcoin.Network.Mainnet].indexOf(wallet.network) > -1;
    }

    getBgClass(wallet){
        var bgClassName = 'testnet-wallet-bg';
        if (this.isMainnet(wallet)){
          switch(wallet.name) {
            case 'ETH':
                bgClassName = 'eth-wallet-bg';
                break;
            case 'BTC':
                bgClassName = 'btc-wallet-bg';
                break;
            case 'XRP':
                bgClassName = 'xrp-wallet-bg';
            default:
              bgClassName = 'testnet-wallet-bg';
          }
        }
        return  "feed " + bgClassName;
      }
    render(){ 
        const {wallet, onClick} =  this.props;        
        
        return  ( 
            <Col sm={6} md={6} xs={6} className="feed-wrapper">
              <div onClick={onClick} className={this.getBgClass(wallet)}>
              
                <span className="name">{wallet.getNetworkName() + " (" + wallet.name + ")"}</span>                 
                
                {wallet.default ? <img className="iconChecked" src={iconChecked}/> : ''}
                
              </div>        
            </Col>
          );
    }
}
    
CoinTemp.propTypes = {    
    wallet: PropTypes.object, 
    onClick: PropTypes.func,    
};
export default CoinTemp;