import React from 'react';
import {injectIntl} from 'react-intl';
import {Field, formValueSelector, clearFields} from "redux-form";
import {connect} from "react-redux";
import Button from '@/components/core/controls/Button';
import createForm from '@/components/core/form/createForm'
import { change } from 'redux-form'
import {fieldDropdown, fieldInput, fieldRadioButton} from '@/components/core/form/customField'
import {required} from '@/components/core/form/validation'
import {MasterWallet} from "@/services/Wallets/MasterWallet";
import {showAlert} from '@/reducers/app/action';
import { showLoading, hideLoading } from '@/reducers/app/action';
import QrReader from 'react-qr-reader';
import { StringHelper } from '@/services/helper';
import PropTypes from 'prop-types';
import { bindActionCreators } from "redux";

import './RestoreWallet.scss';
import Dropdown from '@/components/core/controls/Dropdown';

window.Clipboard = (function (window, document, navigator) { let textArea, copy; function isOS() { return navigator.userAgent.match(/ipad|iphone/i); } function createTextArea(text) { textArea = document.createElement('textArea'); textArea.value = text; document.body.appendChild(textArea); } function selectText() { let range, selection; if (isOS()) { range = document.createRange(); range.selectNodeContents(textArea); selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range); textArea.setSelectionRange(0, 999999); } else { textArea.select(); } } function copyToClipboard() { document.execCommand('copy'); document.body.removeChild(textArea); } copy = function (text) { createTextArea(text); selectText(); copyToClipboard(); }; return { copy }; }(window, document, navigator));

class RestoreWallet extends React.Component {
  constructor(props) {
    super(props);
    
    this.state = {
      erroValueBackup: false, isRestoreLoading: false, inputRestoreWalletValue: ''
    }    
  }

  showAlert(msg, type = 'success', timeOut = 3000, icon = '') {
    this.props.showAlert({
      message: <div className="textCenter">{icon}{msg}</div>,
      timeOut,
      type,
      callBack: () => {},
    });
  }
  showToast(mst) {
    this.showAlert(mst, 'primary', 2000);
  }
  showError(mst) {
    this.showAlert(mst, 'danger', 3000);
  }
  showSuccess(mst) {
    this.showAlert(mst, 'success', 4000, <img className="iconSuccessChecked" src={iconSuccessChecked} />);
  }
  showLoading(status) {
    this.props.showLoading({ message: '' });
  }
  hideLoading() {
    this.props.hideLoading();
  }

  componentDidMount() {    
    if (!this.state.walletData){
      let walletData = MasterWallet.getMasterWallet();
      this.setState({walletData: walletData});
    }
  }

  componentWillUnmount() {
    
  }
  componentDidUpdate (){
  
  }
  componentWillReceiveProps() {       
    
  }

  showLoading = () => {
    this.props.showLoading({message: '',});
  }

  hideLoading = () => {
    this.props.hideLoading();
  }


  onFinish = () => {
   
    const { onFinish } = this.props;
    
    if (onFinish) {      
      onFinish();
    } else {
      
    }
  }

  restoreWallets = () => {
    const { messages } = this.props.intl;
    this.setState({ isRestoreLoading: true, erroValueBackup: false });
    if (this.state.inputRestoreWalletValue != '') {
      const walletData = MasterWallet.restoreWallets(this.state.inputRestoreWalletValue);
      if (walletData !== false) {        
        window.location.reload();
        return;
      }
    }
    this.showError(messages.wallet.action.restore.error);
    this.setState({ erroValueBackup: true, isRestoreLoading: false });
  }

  updateRestoreWalletValue = (evt) => {
    this.setState({
      inputRestoreWalletValue: evt.target.value,
    });
  }
  
  render() {
    const { messages } = this.props.intl;
    return ( 
        <div className="restorewallet">
          <div className="bodyTitle">{messages.wallet.action.restore.description}</div>
            <div className="bodyBackup">
              <textarea
                required
                value={this.state.inputRestoreWalletValue}
                className={this.state.erroValueBackup ? 'error' : ''}
                onChange={evt => this.updateRestoreWalletValue(evt)}
              />
              <Button isLoading={this.state.isRestoreLoading} className="button" cssType="danger" onClick={() => { this.restoreWallets(); }} >
                {messages.wallet.action.restore.button.restore}
              </Button>
            </div>
        </div>
    )
  }
}

RestoreWallet.propTypes = {
  
};

const mapStateToProps = (state) => ({
  
});

const mapDispatchToProps = (dispatch) => ({  
  showAlert: bindActionCreators(showAlert, dispatch),
  showLoading: bindActionCreators(showLoading, dispatch),
  hideLoading: bindActionCreators(hideLoading, dispatch),
  clearFields: bindActionCreators(clearFields, dispatch),
  
});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(RestoreWallet));