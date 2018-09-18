// Write by Phuong


import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Modal from '@/components/core/controls/Modal';
import './WalletPasscode.scss';

import Passcode from '../Passcode';


class WalletPasscode extends React.PureComponent {
  static propTypes = {
    app: PropTypes.object,
    onBack: PropTypes.func,
    onSuccess: PropTypes.func,
  }

  constructor(props) {
    super(props);
    this.state = {
      isShow: false,
      valueConfirm: 0,    
      contentPasscode: '',
    };
    // bind
    // this.handleShowConfirm = ::this.handleShowConfirm;
  }

  componentWillReceiveProps(nextProps) {
    let props = nextProps.app.passcodeData || {};        
    console.log('props',props);    
    if (props.isShow){         
      let contentPasscode = <Passcode confirmValue={props.valueConfirm} onFinish={(value)=> {}} />;   
      this.setState({valueConfirm: props.valueConfirm, isShow: props.isShow, contentPasscode: contentPasscode},()=>{        
        this.modalConfirmPasscodeRef.open();
      });      
    }
    else{
      this.reset();            
    }
  }

  configDefault = {
    isShow: false,
    valueConfirm: 0,    
    onSuccess: () => {},
    onBack: () => {},
  }

  handleShowConfirm(props) {
    const { configConfirmPasscode } = props.app;
    const config = Object.assign({}, this.configDefault, configConfirmPasscode);
    config.onSuccess();
    if (config.isShow) {              
        // call back
        config.onBack();
      
    }
    this.setState({ ...config });
  }

  reset=()=>{
    console.log("reset");
    this.setState({valueConfirm: 0, isShow: false, contentPasscode: ''}); 
  }

  render() {
    const { isShow, valueConfirm } = this.state;  
    // const { messages } = this.props.intl;      
    return (
      
    <Modal modalBodyStyle={{"padding": 0}} onClose={() => {this.reset();}} title={"PASSCODE"} onRef={modal => this.modalConfirmPasscodeRef = modal}>
      <div className="wallet-passscode">
      {/* <div className="wallet-passscode-title">
        Remember this Password. If you forget it, you can lost wallet
      </div> */}
      {this.state.contentPasscode}

      </div>        
    </Modal>
    );
  }
}

const mapState = state => ({
  app: state.app,
});

const mapDispatch = ({
  
});

export default connect(mapState, mapDispatch)(WalletPasscode);
