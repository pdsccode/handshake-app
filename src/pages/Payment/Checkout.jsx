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
import { getCryptoPrice } from '@/reducers/exchange/action';
import { bindActionCreators } from 'redux';
import { MasterWallet } from "@/services/Wallets/MasterWallet";
import { showAlert } from '@/reducers/app/action';
import { showLoading, hideLoading } from '@/reducers/app/action';
import { StringHelper } from '@/services/helper';
import iconSuccessChecked from '@/assets/images/icon/icon-checked-green.svg';

// style
import './Checkout.scss';


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
      walletSelected: false,
      amountCrypto: this.props.amountCrypto,
      toAddress: false,
      isDisableCheckout: false,
      isRestoreLoading: false
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
  showLoading() {
    this.props.showLoading({ message: '' });
  }
  hideLoading() {
    this.props.hideLoading();
  }

  componentDidMount() {
    this.showLoading();
    this.getWalletDefault();
    this.hideLoading();
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
      let result = {
        'fromWallet': this.state.walletSelected,
        'hash': data ? data.hash : ""
      };

      onFinish(result);
    } else {

    }
  }

  getWalletDefault = async () =>{
    const { cryptoCurrency } = this.props;
    let walletDefault = await MasterWallet.getWalletDefault(cryptoCurrency);
    let wallets = MasterWallet.getWallets(cryptoCurrency);

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
        }
      });
    }

    if (!walletDefault){
      if (listWalletCoin.length > 0){
        walletDefault = listWalletCoin[0];
      }
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

    this.setState({wallets: listWalletCoin, walletSelected: walletDefault}, ()=>{
      this.checkValid();
    });
  }

  checkValid = () =>{
    const { amountCrypto, toAddress } = this.props;
    const wallet = this.state.walletSelected;

    let result = true;
    if(wallet && toAddress && amountCrypto) {
      if(amountCrypto <= wallet.balance) {
        result = false;
      }
    }
    this.setState({isDisableCheckout: result})
  }
  sendCoin = () => {
    const { messages } = this.props.intl;
    const { fiatCurrency, amountCrypto, cryptoCurrency, toAddress} = this.props;

    const {walletSelected:wallet} = this.state;
    if(wallet && toAddress && amountCrypto) {
      if(amountCrypto > wallet.balance) {
        this.showError(messages.wallet.action.payment.error.insufficient);
        return;
      }
      else{
        this.submitSendCoin(wallet, toAddress, amountCrypto);
      }
    }

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
      this.setState({walletSelected: wallet}, ()=>{
        MasterWallet.UpdateBalanceItem(wallet);
        this.checkValid();
      });
    });
  }

  submitSendCoin=(wallet, toAddress, amountCrypto)=>{
    const {toCrypto} = this.props;

    this.setState({isRestoreLoading: true});

    wallet.transfer(toAddress, amountCrypto).then(success => {
      this.setState({isRestoreLoading: false});
      if (success.hasOwnProperty('status')){
        if (success.status == 1){
          this.onFinish(success.data);
        }
        else{
          this.showError(this.getMessage(success.message));
        }
      }
    });
  }

  get showPayment(){
    const { amount, fiatCurrency, amountCrypto, cryptoCurrency} = this.props;

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
    const { messages } = this.props.intl;

    return (
      <div className="wallet-info">
      <SendWalletForm onSubmit={this.sendCoin} validate={this.invalidateTransferCoins}>

        <div className ="dropdown-wallet-tranfer">
          <Field
            name="walletSelected"
            component={fieldDropdown}
            placeholder={messages.wallet.action.payment.placeholder.select_wallet}
            defaultText={this.state.walletSelected.text}
            list={this.state.wallets}
            onChange={(item) => {
                this.onItemSelectedWallet(item);
              }
            }
          />
        </div>

        <label className='label-balance'>{messages.wallet.action.payment.label.wallet_balance} { this.state.walletSelected ? StringHelper.format("{0} {1}", this.state.walletSelected.balance, this.state.walletSelected.name) : ""}</label>

        <Button className="button-wallet-cpn" isLoading={this.state.isRestoreLoading} disabled={this.state.isDisableCheckout} type="submit" block={true}>{messages.wallet.action.payment.button.checkout}</Button>

        <div className="help"><div className="badge badge-light">Need support?</div></div>
      </SendWalletForm>
      </div>
    )
  }

  render() {
    const { messages } = this.props.intl;
    return (<div>
        {this.showPayment}
        {this.showTabs}
        {this.showWallet}
      </div>)

  }
}

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
