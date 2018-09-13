import React from 'react';
import PropTypes from 'prop-types';

import './WalletPreferences.scss';
import Switch from '../../../../components/core/controls/Switch';
import Input from '../Input';
import Modal from '@/components/core/controls/Modal';
import {injectIntl} from 'react-intl';
import { ENGINE_METHOD_DIGESTS } from 'constants';


class WalletPreferences extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      walletNameContent: "",
      walletName: this.props.wallet.title,
      isHideBalance: this.props.wallet.hideBalance,
    };
    this.messages = this.props.intl.messages;
  }

  onHideBalanceChange = (isChecked) => {
    this.props.wallet.hideBalance = isChecked;
    this.props.onUpdateWalletName(this.props.wallet);
  }


  handleWalletNameChange=(value) => {
    this.setState({walletName: value}, ()=>{
      this.renderModalName();
    });
  }

  handleUpdateNameOnClick = () => {
    if (this.state.walletName){
      this.props.wallet.title = this.state.walletName;
      this.props.onUpdateWalletName(this.props.wallet);
      this.modalWalletNameRef.close();
    }
  }

  renderModalName=()=>{
    const disabled = !this.state.walletName ? "disabled" : "";
    this.setState({walletNameContent: (
        <div className="update-name">
          <label>{this.messages.wallet.action.preferecens.update_name.label}</label>
          <Input required placeholder={this.messages.wallet.action.preferecens.update_name.title} maxlength="40" value={this.state.walletName} onChange={(value) => {this.handleWalletNameChange(value)}} />
          <button type="button" onClick={()=> {this.handleUpdateNameOnClick();}} disabled={!this.state.walletName} className="button wallet-new-button">{this.messages.wallet.action.preferecens.update_name.button.save}</button>
        </div>
      )
    }, ()=>{
      this.modalWalletNameRef.open();
    });
  }

  onOpenModalName=()=>{
    this.setState({walletName : this.props.wallet.title}, ()=>{
      this.renderModalName();
    });
  }

  render() {
    const { onItemClick, wallet } = this.props;

    return (
      <div>
        <Modal onClose={()=>{this.setState({walletNameContent: ""})}} title="Wallet Name" onRef={modal => this.modalWalletNameRef = modal} customBackIcon={this.props.customBackIcon} modalHeaderStyle={this.props.modalHeaderStyle}>
          {this.state.walletNameContent}
        </Modal>
          <div className="box-setting">
              <div className="item" onClick={()=> {this.onOpenModalName();}}>
                  <div className="name">
                      <label>{this.messages.wallet.action.preferecens.list_item.wallet_name}</label>
                  </div>
                  <div className="value">
                      <span className="text">{wallet.title}</span>
                  </div>
              </div>

              <div className="item">
                  <div className="name">
                      <label>{this.messages.wallet.action.preferecens.list_item.hide_balance}</label>
                  </div>
                  <div className="value">
                    <Switch isChecked={this.props.wallet.hideBalance} onChange={(isChecked)=> {this.onHideBalanceChange(isChecked)}} />
                  </div>
              </div>

              <div className="item" onClick={this.props.onWarningClick}>
                  <div className="name">
                      <label>{this.messages.wallet.action.preferecens.list_item.backup_wallet}</label>
                  </div>
                  <div className="value">

                  </div>
              </div>

              <div className="item" onClick={this.props.onDeleteWalletClick}>
                  <div className="name">
                      <label className="text-danger">{this.messages.wallet.action.preferecens.list_item.delete_wallet}</label>
                  </div>
                  <div className="value">

                  </div>
              </div>


          </div>

        <div className="passscode">
          <div className="passscode-title">
            Enter your passcode:
          </div>
          <div className="passscode-items">
              <span className="passscode-item active"></span>
              <span className="passscode-item active"></span>
              <span className="passscode-item"></span>
              <span className="passscode-item"></span>
              <span className="passscode-item"></span>
              <span className="passscode-item"></span>
          </div>
          <div className="passscode-keyboard">
            <span className="passscode-keyboard-item">1</span>
            <span className="passscode-keyboard-item">2</span>
            <span className="passscode-keyboard-item">3</span>
            <span className="passscode-keyboard-item">4</span>
            <span className="passscode-keyboard-item">5</span>
            <span className="passscode-keyboard-item">6</span>
            <span className="passscode-keyboard-item">7</span>
            <span className="passscode-keyboard-item">8</span>
            <span className="passscode-keyboard-item">9</span>
            <span className="passscode-keyboard-item">0</span>
            <span className="passscode-keyboard-item">DEL</span>            
          </div>

        </div>


        </div>
    );
  }
}

WalletPreferences.propTypes = {
  onWarningClick: PropTypes.func,
  onDeleteWalletClick: PropTypes.func,
};

export default injectIntl(WalletPreferences);
