import React from 'react';
import PropTypes from 'prop-types';
import { Field, clearFields, change } from 'redux-form';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import Button from '@/components/core/controls/Button';
import ModalDialog from '@/components/core/controls/ModalDialog';
import Modal from '@/components/core/controls/Modal';
import createForm from '@/components/core/form/createForm';
import { fieldDropdown, fieldInput } from '@/components/core/form/customField';
import { API_URL } from "@/constants";
import { getCryptoPrice } from '@/reducers/exchange/action';
import CryptoPrice from '@/models/CryptoPrice';
import { bindActionCreators } from 'redux';
import { MasterWallet } from "@/services/Wallets/MasterWallet";
import { showAlert } from '@/reducers/app/action';
import { showLoading, hideLoading } from '@/reducers/app/action';
import { StringHelper } from '@/services/helper';
import iconQRCode from '@/assets/images/icon/icon-qrcode-solid.svg';
import iconCopy from '@/assets/images/icon/icon-copy.svg';
import iconSuccessChecked from '@/assets/images/icon/icon-checked-green.svg';

const QRCode = require('qrcode.react');
import qs from 'querystring';

// style
import './Checkout.scss';

const amountValid = value => (value && isNaN(value) ? 'Invalid amount' : undefined);

const nameFormSendWallet = 'sendWallet';
const SendWalletForm = createForm({ propsReduxForm: { form: nameFormSendWallet, enableReinitialize: true, clearSubmitErrors: true}});

window.Clipboard = (function (window, document, navigator) {
  let textArea,
    copy; function isOS() { return navigator.userAgent.match(/ipad|iphone/i); } function createTextArea(text) { textArea = document.createElement('textArea'); textArea.value = text; document.body.appendChild(textArea); } function selectText() {
    let range,
      selection; if (isOS()) { range = document.createRange(); range.selectNodeContents(textArea); selection = window.getSelection(); selection.removeAllRanges(); selection.addRange(range); textArea.setSelectionRange(0, 999999); } else { textArea.select(); }
  } function copyToClipboard() { document.execCommand('copy'); document.body.removeChild(textArea); } copy = function (text) { createTextArea(text); selectText(); copyToClipboard(); }; return { copy };
}(window, document, navigator));

class Checkout extends React.Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      wallets: [],
      //walletDefault: false,
      walletSelected: false,
      //walletSelectedAddress: "",
      active: this.props.active,
      isShowQRCode: false,
      walletsData: false,
      inputSendAmountValue: 0,
      toAddress: this.props.toAddress,
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
    this.showAlert(mst, 'success', 5000, <img className="iconSuccessChecked" src={iconSuccessChecked} />);
  }
  showLoading(status) {
    this.props.showLoading({ message: '' });
  }
  hideLoading() {
    this.props.hideLoading();
  }

  componentWillReceiveProps() {
    const { active, fromAddress, toAddress, amount } = this.props;

    if (toAddress) {
      this.setState({ toAddress: toAddress });
    }

    // if (fromAddress) {
    //   this.setState({ walletSelectedAddress: fromAddress });
    // }

    if (amount) {
      this.setState({ inputSendAmountValue: amount });
    }
  }

  componentDidMount() {
    this.props.clearFields(nameFormSendWallet, false, false, "to_address", "amountCoin");
    if (this.props.amount){
      this.props.rfChange(nameFormSendWallet, 'amountCoin', this.props.amount);
    }

    if (this.props.toAddress){
      this.setState({inputAddressAmountValue: this.props.toAddress});
      this.props.rfChange(nameFormSendWallet, 'to_address', this.props.toAddress);
    }
  }

  componentDidUpdate() {
    if (this.props.active && !this.state.active){
      this.setState({active: this.props.active});
      this.props.clearFields(nameFormSendWallet, false, false, "to_address", "amountCoin");

      // if (this.props.fromAddress){
      //   this.setState({walletSelectedAddress: this.props.fromAddress});
      // }

      if (this.props.toAddress){
        this.setState({inputAddressAmountValue: this.props.toAddress});
        this.props.rfChange(nameFormSendWallet, 'to_address', this.props.toAddress);
      }

      console.log("componentDidUpdate");
      this.getWalletDefault();
    }
    else if (!this.props.active && this.state.active){
      this.setState({active: this.props.active});
    }
  }

  showLoading = () => {
    this.props.showLoading({message: '',});
  }

  hideLoading = () => {
    this.props.hideLoading();
  }

  copyToClipboard =(text) => {
    const textField = document.createElement('textarea');
    textField.innerText = text;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();
  }

  onFinish = (data) => {
    const { onFinish } = this.props;

    if (onFinish) {
      let result = {'toAddress': this.state.inputAddressAmountValue,
        'fromWallet': this.state.walletSelected,
        'amountCoin': this.state.inputSendAmountValue,
        'hash': data ? data.hash : ""
      };

      onFinish(result);
    } else {

    }
  }

  getWalletDefault = async () =>{
    const { coinName, listWallet, wallet, fromAddress } = this.props;

    let wallets = listWallet;
    let walletDefault = false;
    if (!wallets){
      wallets = MasterWallet.getWallets(coinName);
    }

    if(fromAddress && wallets && wallets.length > 0) {
      wallets.forEach((wal) => {
        if(fromAddress == wal.address) {
          walletDefault = wal;
        }
      });
    }

    if (!walletDefault && coinName){
      walletDefault = await MasterWallet.getWalletDefault(coinName);
    }

    // set name + text for list:
    let listWalletCoin = [];
    if (wallets.length > 0){
      wallets.forEach((wal) => {
        if(!wal.isCollectibles){
          wal.text = wal.getShortAddress() + " (" + wal.name + "-" + wal.getNetworkName() + ")";
          if (process.env.isLive){
            wal.text = wal.getShortAddress() + " (" + wal.className + " " + wal.name + ")";
          }
          wal.id = wal.address + "-" + wal.getNetworkName() + wal.name;
          listWalletCoin.push(wal);


          if(!walletDefault && coinName == wal.name) {
            walletDefault = wal;
          }
        }
      });
    }

    if (!walletDefault){
      if (listWalletCoin.length > 0){
        walletDefault = listWalletCoin[0];
      }
    }

    // set name for walletDefault:
    if (wallet){
      walletDefault = wallet;
    }
    if (walletDefault){
      walletDefault.text = walletDefault.getShortAddress() + " (" + walletDefault.name + "-" + walletDefault.getNetworkName() + ")";
      if (process.env.isLive){
        walletDefault.text = walletDefault.getShortAddress() + " (" + walletDefault.className + " " + walletDefault.name + ")";
      }
      walletDefault.id = walletDefault.address + "-" + walletDefault.getNetworkName() + walletDefault.name;

      // get balance for first item + update to local store:
      walletDefault.getBalance().then(result => {
        walletDefault.balance = walletDefault.formatNumber(result);
        this.setState({walletSelected: walletDefault});
        MasterWallet.UpdateBalanceItem(walletDefault);
      });
    }

    this.setState({wallets: listWalletCoin, walletSelected: walletDefault}, ()=>{//walletDefault: walletDefault,
      this.props.rfChange(nameFormSendWallet, 'walletSelected', walletDefault);
    });

    if(walletDefault) {
      //callback close form
      const { chooseWallet } = this.props;

      if (chooseWallet) {
        chooseWallet(walletDefault);
      }
    }
  }

  sendCoin = () => {
    const { messages } = this.props.intl;

    let wallet = this.state.walletSelected;
    let amount = this.state.inputSendAmountValue;
    if(wallet && amount) {
      if(amount > wallet.balance) {
        this.showError(messages.wallet.action.payment.error.insufficient);
        return;
      }
    }

    this.modalConfirmTranferRef.open();
  }

  invalidateTransferCoins = (value) => {
    const { messages } = this.props.intl;

    if (!this.state.walletSelected) return {};
    let errors = {};
    if (this.state.walletSelected){
      // check address:
      let result = this.state.walletSelected.checkAddressValid(value['to_address']);
      if (result !== true)
          errors.to_address = this.getMessage(result);
      // check amount:

      if (parseFloat(this.state.walletSelected.balance) <= parseFloat(value['amountCoin']))
        errors.amountCoin = `${messages.wallet.action.transfer.error}`
    }
    return errors
  }

  getMessage(str){
    const { messages } = this.props.intl;

    let result = "";
    try{
      result = eval(str);
    }
    catch(e){
      console.error(e);
    }

    return result;
  }

  openQRCode=()=>{
    this.setState({isShowQRCode: !this.state.isShowQRCode});
  }

  copyAddress=()=>{
    const { messages } = this.props.intl;

    Clipboard.copy(this.state.toAddress);
    this.showToast(messages.wallet.action.copy.message);
  }

  onItemSelectedWallet = (item) =>{

    let wallet = MasterWallet.convertObject(item);
    this.setState({walletSelected: wallet});

    wallet.getBalance().then(result => {
      wallet.balance = wallet.formatNumber(result);
      this.setState({walletSelected: wallet});
      MasterWallet.UpdateBalanceItem(wallet);
    });

    //callback close form
    const { chooseWallet } = this.props;

    if (chooseWallet) {
      chooseWallet(wallet);
    }
  }

  submitSendCoin=()=>{
    this.setState({isRestoreLoading: true});
    this.modalConfirmTranferRef.close();

    this.state.walletSelected.transfer(this.state.inputAddressAmountValue, this.state.inputSendAmountValue).then(success => {

      this.setState({isRestoreLoading: false});
      if (success.hasOwnProperty('status')){
        if (success.status == 1){
          //console.log(success);
          this.showSuccess(this.getMessage(success.message));
          this.onFinish(success.data);
        }
        else{
          this.showError(this.getMessage(success.message));
        }
      }
    });
  }

  get showPayment(){
    const { wallet, amount, fiatCurrency, amountCrypto, cryptoCurrency} = this.props;

    let icon = '';
    try{ icon = require("@/assets/images/icon/wallet/coins/" + cryptoCurrency.toLowerCase() + '.svg')} catch (ex){console.log(ex)};

    return (
      <div className="amount-info">
        <div className="icon"><img src={icon} /></div>
        <div className="crypto-amount">{amountCrypto} {cryptoCurrency}</div>
        <div className="amount">{amount} {fiatCurrency}</div>
      </div>
    )
  }

  get showTabs(){

    return (
      <nav className="nav nav-pills nav-fill">
        <a className="nav-item nav-link active" href="#">Wallet</a>
        <a className="nav-item nav-link" href="#">Scan</a>
        <a className="nav-item nav-link" href="#">Copy</a>
      </nav>
    )
  }

  get showWallet(){
    const { wallet} = this.props;

    return (
      <div className="wallet-info">
        <div className="address">{wallet.getShortAddress()}</div>
        <div className="label">Wallet: </div>

        <div className="clearfix"></div>
        <div className="balance">{wallet.balance} {wallet.name}</div>
        <div className="label">Balance: </div>
      </div>
    )
  }

  get callAction(){
    const { wallet} = this.props;

    return (
      <div className="call-action">
        <Button className="button-wallet-cpn" type="button" block={true} onClick={this.DoCheckout}>Checkout</Button>
        <div className="help"><div className="badge badge-light">Need support?</div></div>
      </div>
    )
  }

  DoCheckout(){
    console.log('DoCheckout');
  }

  render() {
    const { messages } = this.props.intl;
    return (<div>
        {this.showPayment}
        {this.showTabs}
        {this.showWallet}
        {this.callAction}
      </div>)

  }
}

 {/* <ModalDialog title="Confirmation" onRef={modal => this.modalConfirmTranferRef = modal}>
          <div className="bodyConfirm"><span>{messages.wallet.action.transfer.text.confirm_transfer} {this.state.inputSendAmountValue} {this.state.walletSelected ? this.state.walletSelected.name : ''}?</span></div>
          <div className="bodyConfirm">
              <Button className="left" cssType="danger" onClick={this.submitSendCoin} >{messages.wallet.action.transfer.button.confirm}</Button>
              <Button className="right" cssType="secondary" onClick={() => { this.modalConfirmTranferRef.close(); }}>Cancel</Button>
          </div>
          </ModalDialog>

        <SendWalletForm className="checkout-wrapper" onSubmit={this.sendCoin} validate={this.invalidateTransferCoins}>

          <div className="bgBox">
            <p className="labelText">{messages.wallet.action.payment.label.to_address}</p>
            <div className="toAddress">
              <p className="address">{this.state.toAddress}</p>
              { this.state.isShowQRCode ?
                <div className="div-qr-code">
                  <QRCode size={250} value={this.state.toAddress} />
                </div>
                : ""
              }

              <p className="qrCode" onClick={this.openQRCode} >{this.state.isShowQRCode ? "Hide" : "Show"} <img src={iconQRCode} /> </p>
              <p className="copyAddress" onClick={this.copyAddress} >Copy <img src={iconCopy} /> </p>
            </div>

            <label className='label-balance'>{messages.wallet.action.payment.label.wallet_balance} { this.state.walletSelected ? StringHelper.format("{0} {1}", this.state.walletSelected.balance, this.state.walletSelected.name) : ""}</label>
            </div>

          <Button className="button-wallet-cpn" isLoading={this.state.isRestoreLoading}  type="submit" block={true}>{messages.wallet.action.payment.button.checkout}</Button>

        </SendWalletForm>*/}

const mapState = (state) => ({
});

const mapDispatch = (dispatch) => ({
  rfChange: bindActionCreators(change, dispatch),
  showAlert: bindActionCreators(showAlert, dispatch),
  showLoading: bindActionCreators(showLoading, dispatch),
  hideLoading: bindActionCreators(hideLoading, dispatch),
  clearFields: bindActionCreators(clearFields, dispatch),
  getCryptoPrice: bindActionCreators(getCryptoPrice, dispatch),
});


export default injectIntl(connect(mapState, mapDispatch)(Checkout));
