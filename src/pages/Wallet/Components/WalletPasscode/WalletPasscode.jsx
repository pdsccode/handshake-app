// Write by Phuong

import React from 'react';
import PropTypes from 'prop-types';

import './WalletPasscode.scss';

class WalletPasscode extends React.PureComponent {
    
  constructor(props) {
    super(props);    
    this.state = {
      
    }   
  }

  componentDidMount() {
   
  }

  componentWillUnmount() {
   
  }


  render() {      
    
    
    return (
        
      <div className="wallet-passscode">
      <div className="wallet-passscode-title">
        Remember this Password. If you forget it, you can lost wallet
      </div>
      

    </div>
    );
  }
}

WalletPasscode.propTypes = {
  confirmValue: PropTypes.number,
  onFinish: PropTypes.func,  
};

export default WalletPasscode;
