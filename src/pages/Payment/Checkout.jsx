import React from 'react';
import PropTypes from 'prop-types';
import { Field, clearFields, change } from 'redux-form';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import Button from '@/components/core/controls/Button';
import ModalDialog from '@/components/core/controls/ModalDialog';
import Modal from '@/components/core/controls/Modal';
import { required } from '@/components/core/form/validation';
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
import { BigNumber } from 'bignumber.js';
import iconQRCode from '@/assets/images/icon/icon-qrcode-solid.svg';

const QRCode = require('qrcode.react');
import qs from 'querystring';

// style
import './Checkout.scss';

const amountValid = value => (value && isNaN(value) ? 'Invalid amount' : undefined);

const nameFormSendWallet = 'sendWallet';
const SendWalletForm = createForm({ propsReduxForm: { form: nameFormSendWallet, enableReinitialize: true, clearSubmitErrors: true}});


class Checkout extends React.Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      wallets: [],
      walletDefault: false,
      walletSelected: false,
      walletSelectedAddress: "",
      active: this.props.active,
      isShowQRCode: false,
      walletsData: false,
      rateBTC: 0,
      rateETH: 0,
      inputSendAmountValue: 0,
      inputSendMoneyValue: 0,
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
    //this.props.clearFields(nameFormSendWallet, false, false, 'to_address', 'amountCoin');
    const { active, fromAddress, toAddress, amount } = this.props;

    if (toAddress) {
      this.setState({ toAddress: toAddress });
    }

    if (fromAddress) {
      this.setState({ walletSelectedAddress: fromAddress });
    }

    if (amount) {
      this.setState({ inputSendAmountValue: amount });
      this.updateAddressAmountValue(null, this.props.amount);
      //console.log("componentWillReceiveProps amount", amount);
    }

    // if(!active && this.state.active){
    //   this.setState({active: active, inputSendAmountValue: 0, inputSendMoneyValue: 0});
    //   this.resetForm();
    // }
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

    //this.getWalletDefault();
    if (!this.state.walletSelected.isToken) {
      this.getRate('BTC');
      this.getRate('ETH');
    }

  }

  componentDidUpdate() {
    if (this.props.active && !this.state.active){

      this.setState({active: this.props.active});

      this.props.clearFields(nameFormSendWallet, false, false, "to_address", "amountCoin");
      // if (this.props.amount){
      //   this.updateAddressAmountValue(null, this.props.amount);
      //   this.props.rfChange(nameFormSendWallet, 'amountCoin', this.props.amount);
      // }

      if (this.props.fromAddress){
        this.setState({walletSelectedAddress: this.props.fromAddress});
      }

      if (this.props.toAddress){
        this.setState({inputAddressAmountValue: this.props.toAddress});
        this.props.rfChange(nameFormSendWallet, 'to_address', this.props.toAddress);
      }

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

  onFinish = () => {
    const { onFinish } = this.props;

    if (onFinish) {
      let result = {'toAddress': this.state.inputAddressAmountValue, "fromWallet": this.state.walletSelected, "amountCoin": this.state.inputSendAmountValue}
      onFinish(result);
    } else {

    }
  }

  getRate = (currency) => {
    var data = {amount: 1, currency: currency};
    this.props.getCryptoPrice({
      PATH_URL: API_URL.EXCHANGE.GET_CRYPTO_PRICE,
      qs: data,
      successFn: (res) => {
        const cryptoPrice = CryptoPrice.cryptoPrice(res.data);
        const price = new BigNumber(cryptoPrice.fiatAmount).toNumber();
        //console.log("getRate", data, res.data)
        if(currency == "BTC")
          this.setState({rateBTC: price});
        else
          this.setState({rateETH: price});
      },
      errorFn: (err) => {
        console.error("Error", err);
      },
    });
  }

  getWalletDefault = async () =>{
    const { isShowWallets, coinName, listWallet, wallet, fromAddress } = this.props;

    let wallets = listWallet;
    let walletDefault = isShowWallets ? null : this.state.walletDefault;
    if (!wallets){
      wallets = MasterWallet.getMasterWallet();
    }
    console.log("getWalletDefault 0", walletDefault);

    if(isShowWallets && fromAddress && wallets.length > 0) {
      wallets.forEach((wal) => {
        if(fromAddress == wal.address) {
          walletDefault = wal;console.log("getWalletDefault 1", walletDefault);
        }
      });
    }

    if (!walletDefault && coinName){
      walletDefault = await MasterWallet.getWalletDefault(coinName);console.log("getWalletDefault 2", walletDefault);
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
            walletDefault = wal;console.log("getWalletDefault 3", this.state.walletSelectedAddress);
          }
        }
      });
    }

    if (!walletDefault){
      if (listWalletCoin.length > 0){console.log("getWalletDefault 4", walletDefault);
        walletDefault = listWalletCoin[0];
      }
    }

    // set name for walletDefault:
    if (wallet){
      walletDefault = wallet;console.log("getWalletDefault 5", walletDefault);
    }
    if (walletDefault){
      walletDefault.text = walletDefault.getShortAddress() + " (" + walletDefault.name + "-" + walletDefault.getNetworkName() + ")";
      if (process.env.isLive){
        walletDefault.text = walletDefault.getShortAddress() + " (" + walletDefault.className + " " + walletDefault.name + ")";
      }
      walletDefault.id = walletDefault.address + "-" + walletDefault.getNetworkName() + walletDefault.name;

      // get balance for first item + update to local store:
      walletDefault.getBalance().then(result => {
        walletDefault.balance = result;
        this.setState({walletSelected: walletDefault});
        MasterWallet.UpdateBalanceItem(walletDefault);
      });
    }

    this.setState({wallets: listWalletCoin, walletDefault: walletDefault, walletSelected: walletDefault}, ()=>{
      this.props.rfChange(nameFormSendWallet, 'walletSelected', walletDefault);
    });

    console.log("getWalletDefault 6", walletDefault);
  }

  sendCoin = () => {
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

  updateAddressAmountValue = (evt, val) => {
    let amount = evt ? evt.target.value : null, rate = 0, money = 0;
    if(!amount) amount = val;

    if(this.state.walletSelected && this.state.walletSelected.name == "BTC")
      rate = this.state.rateBTC;
    else
      rate = this.state.rateETH;

    if(!isNaN(amount)){
      money = amount * rate;
      this.setState({
        inputSendAmountValue: amount,
        inputSendMoneyValue: money.toFixed(0)
      });
    }

    this.props.rfChange(nameFormSendWallet, 'amountCoin', amount);
    this.props.rfChange(nameFormSendWallet, 'amountMoney', money);
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

  updateAddressMoneyValue = (evt) => {
    let money = evt.target.value, rate = 0, amount = 0;
    if(this.state.walletSelected && this.state.walletSelected.name == "BTC")
      rate = this.state.rateBTC;
    else
      rate = this.state.rateETH;

    if(!isNaN(money)){
      amount = money/rate;
      this.setState({
        inputSendAmountValue: amount,
        inputSendMoneyValue: money
      });

      this.props.rfChange(nameFormSendWallet, 'amountCoin', amount);
      this.props.rfChange(nameFormSendWallet, 'amountMoney', money);
    }
  }

  openQRCode=()=>{
    this.setState({isShowQRCode: !this.state.isShowQRCode});
  }

  submitSendCoin=()=>{
    this.setState({isRestoreLoading: true});
    this.modalConfirmTranferRef.close();
    console.log(this.state.walletSelected, this.state.inputAddressAmountValue, this.state.inputSendAmountValue);
    this.state.walletSelected.transfer(this.state.inputAddressAmountValue, this.state.inputSendAmountValue).then(success => {

      this.setState({isRestoreLoading: false});
      if (success.hasOwnProperty('status')){
        if (success.status == 1){
          console.log(success);
          this.showSuccess(this.getMessage(success.message));
          this.onFinish();
          // start cron get balance auto ...
          // todo hanlde it ...
        }
        else{
          this.showError(this.getMessage(success.message));
        }
      }
    });
  }

  render() {
    const { messages } = this.props.intl;
    return (
      <div>
          {/* Dialog confirm transfer coin */}
          <ModalDialog title="Confirmation" onRef={modal => this.modalConfirmTranferRef = modal}>
          <div className="bodyConfirm"><span>{messages.wallet.action.transfer.text.confirm_transfer} {this.state.inputSendAmountValue} {this.state.walletSelected ? this.state.walletSelected.name : ''}?</span></div>
          <div className="bodyConfirm">
              <Button className="left" cssType="danger" onClick={this.submitSendCoin} >{messages.wallet.action.transfer.button.confirm}</Button>
              <Button className="right" cssType="secondary" onClick={() => { this.modalConfirmTranferRef.close(); }}>Cancel</Button>
          </div>
          </ModalDialog>


          <SendWalletForm className="sendwallet-wrapper" onSubmit={this.sendCoin} validate={this.invalidateTransferCoins}>

          {/* Box: */}
            <div className="bgBox">
              <p className="labelText">{messages.wallet.action.payment.label.to_address}</p>
              <div className="toAddress">
                <p>{this.state.toAddress}</p>
                { this.state.isShowQRCode ?
                  <div className="div-qr-code">
                    <QRCode size={250} value={this.state.toAddress} />
                  </div>
                  : ""
                }

                <p className="qrLink" onClick={this.openQRCode} ><img src={iconQRCode} /> <u>{this.state.isShowQRCode ? "Hide QR code" : "Show QR code"}</u></p>
              </div>

              <div className ="dropdown-wallet-tranfer">
                <p className="labelText">{messages.wallet.action.payment.label.from_wallet}</p>
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
              </div>

            <Button className="button-wallet-cpn" isLoading={this.state.isRestoreLoading}  type="submit" block={true}>{messages.wallet.action.payment.button.checkout}</Button>
          </SendWalletForm>
        </div>
    )
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
