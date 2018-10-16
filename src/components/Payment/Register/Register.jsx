import axios from 'axios';
import React from 'react';
import {injectIntl} from 'react-intl';
import {connect} from "react-redux";
import { showAlert, showLoading, hideLoading } from '@/reducers/app/action';
import PropTypes from 'prop-types';
import Input from '../../Wallet/Input';
import { setLanguage } from '@/reducers/app/action';
import Button from '@/components/core/controls/Button';
import Modal from '@/components/core/controls/Modal';
import local from '@/services/localStore';
import {APP} from '@/constants';
import { Ethereum } from '@/services/Wallets/Ethereum.js';
import { Bitcoin } from '@/services/Wallets/Bitcoin';
import ListCoin from '@/components/Wallet/ListCoin';
import './Register.scss';
import '../../Wallet/WalletPreferences/WalletPreferences.scss';
import iconRemove from '@/assets/images/icon/comment/delete-icon.svg';
import { storeList, storeUpdate, storeDetail, storeCreate } from '@/reducers/auth/action';
import { ICON } from '@/styles/images';
import valid from '@/services/validate';

const supportWallets = ['BTC', 'ETH', 'BCH', 'XRP', 'EOS'];

class Register extends React.Component {
  static propTypes = {
    setLanguage: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      switchContent: '',
      listCurrenciesContent: '',

      inputEmail: '',
      inputStoreId: '',
      modalEmail: '',
      modalStoreID: '',
      modalConfirmURL: '',
      modalListCoin: '',
      wallets: false,
      store: this.props.store,
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
    this.showAlert(mst, 'success', 4000, ICON.SuccessChecked() );
  }

  componentDidMount(){
    this.props.showLoading();
    this.loadStore();
    this.props.hideLoading();
  }

  loadStore = () => {
    const store = this.state.store;

    // const profile = local.get(APP.AUTH_PROFILE);
    // if(profile){
    //   Store.Store_id = profile.username;
    //   Store.email = profile.email;
    // }

    // let wallets = [];
    // supportWallets.map(e => {
    //   let arr = Store.wallets.filter(w => {
    //     return w.name == e;
    //   });

    //   if(arr && arr.length){
    //     wallets.push(arr[0]);
    //   }
    //   else{
    //     wallets.push({name: e, address: ''});
    //   }
    // });

    // Store.wallets = wallets;
    // this.setState({Store});
  }

  selectWallet=(w)=>{
    let { wallets } = this.state.store;

    this.setState({modalListCoin:
      <ListCoin
        addressSelected={w.address}
        crypto={w.name}
        onSelect={w => {
          if(wallets){
            wallets.some((wallet) => {
              if (wallet.name == w.name){
                wallet.address = w.address;
                return true;
              }
            });

            this.setState({ wallets, modalListCoin: ''}, ()=> {
              this.modalListCoinRef.close();
            });
          }
         }}
      />
    }, ()=> {
      this.modalListCoinRef.open();
    });
  }

  deleteWallet=(w)=>{
    let { wallets } = this.state.store;

    if(wallets){
      wallets.some((wallet) => {
        if (wallet.name == w.name && wallet.address == w.address){
          wallet.address = "";
          return true;
        }
      });

      // for(let i in wallets){
      //   console.log(wallets[i]);
      //   if(w.address == wallets[i].address && w.name == wallets[i].name){
      //     wallets[i] = {name: w.name, address: ''};
      //     break;
      //   }
      // }
      this.setState({wallets});
    }
  }

  openFormEmail=()=>{

    this.setState({modalEmail: (
        <div className="update-name">
          <label>Email to receive customer payment, new updates...</label>
          <Input required placeholder="Email" maxLength="40" value={this.state.Store.email} onChange={(value) => {this.changeEmail(value)}} />
          <Button type="button" onClick={()=> {this.updateEmail();}} block={true} className="button-wallet-cpn">Save</Button>
        </div>
      )
    }, ()=>{
      this.modalEmailRef.open();
    });
  }

  openFormStoreID=()=>{

    this.setState({modalStoreID: (
        <div className="update-name">
          <label>Store ID</label>
          <Input required placeholder="Store ID" maxLength="40" value={this.state.inputStoreId} onChange={(value) => {this.changeStoreID(value)}} />
          <Button onClick={()=> {this.updateStoreID();}} block={true} className="button-wallet-cpn">Save</Button>
        </div>
      )
    }, ()=>{
      this.modalStoreIDRef.open();
    });
  }

  openFormConfirmURL=()=>{

    this.setState({modalConfirmURL: (
        <div className="update-name">
          <label>Link used for redirect after complete order</label>
          <Input required placeholder="Confirm URL" maxLength="40" value={this.state.Store.confirm_url} onChange={(value) => {this.changeEmail(value)}} />
          <Button onClick={(value)=> {this.updateConfirmURL(value);}} block={true} className="button-wallet-cpn">Save</Button>
        </div>
      )
    }, ()=>{
      this.modalConfirmURLRef.open();
    });
  }

  changeEmail=(value) => {
    this.setState({inputEmail: value});
  }

  changeStoreID=(value) => {
    this.setState({inputStoreID: value});
  }

  updateStoreID() {
    const { messages } = this.props.intl;
    let {inputStoreID, store} = this.state;

    if (inputStoreID) {console.log(1, inputStoreID);
      this.props.checkUsernameExist({
        PATH_URL: 'user/username-exist',
        qs: { username: inputStoreID },
        successFn: (res) => {console.log(2, inputStoreID);
          if (!res.data) {console.log(3, inputStoreID);
            const params = new URLSearchParams();
            params.append('username', inputStoreID);
            this.props.storeUpdate({
              PATH_URL: 'user/profile',
              data: params,
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              METHOD: 'POST',
              successFn: () => {console.log('showSuccess', inputStoreID);
                this.showSuccess(messages.me.profile.username.success);
                store.store_id = inputStoreID;
                this.setState({Store}, ()=>{
                  this.modalStoreIDRef.close();
                });
              },
            });
          } else {console.log('showError', inputStoreID);
            this.showError(messages.me.profile.username.exist);
          }
        },
      });
    } else {console.log('showToast', inputStoreID);
      this.showToast(messages.me.profile.username.required);
    }
  }

  updateEmail2 = (value) => {
    const { messages } = this.props.intl;
    let {inputEmail, store} = this.state;

    if (!store){
      return;
    }

    store.email = inputEmail;
    this.setState({store}, ()=>{
      this.modalEmailRef.close();
    });
  }

  updateEmail() {
    const { messages } = this.props.intl;
    const inputEmail = this.state.inputEmail || this.localEmail;
    const { emailStart, code } = this.state;

    if (inputEmail) {
      if (valid.email(inputEmail)) {
        this.showError(messages.me.profile.verify.alert.notValid.client.email);
        return;
      }

      if (emailStart !== inputEmail) {
        this.props.verifyEmail({
          PATH_URL: `user/verification/email/start?email=${inputEmail}`,
          headers: { 'Content-Type': 'multipart/form-data' },
          METHOD: 'POST',
          successFn: (data) => {
            if (data.status) {
              this.showSuccess(messages.me.profile.verify.alert.send.email);
              this.setState(() => ({ emailStart: inputEmail, isShowVerificationEmailCode: true }));
              local.save(APP.EMAIL_NEED_VERIFY, inputEmail);
            }
          },
          errorFn: () => {
            this.showError(messages.me.profile.verify.alert.notValid.client.email);
          },
        });
      } else {
        if (!code) {
          this.showError(messages.me.profile.verify.alert.require.email);
          return;
        }

        this.props.submitEmail({
          PATH_URL: `user/verification/email/check`,
          qs: {
            inputEmail,
            code,
          },
          headers: { 'Content-Type': 'multipart/form-data' },
          METHOD: 'POST',
          successFn: () => {
            const params = new URLSearchParams();
            params.append('email', inputEmail);
            this.props.authUpdate({
              PATH_URL: 'user/profile',
              data: params,
              headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
              METHOD: 'POST',
              successFn: () => {
                this.setState({ isShowVerificationEmailCode: false });
                this.showSuccess(messages.me.profile.verify.alert.success.email);
              },
              errorFn: () => {
                this.showError(messages.me.profile.verify.alert.require.email);
              },
            });
          },
          errorFn: () => {
            this.showError(messages.me.profile.verify.alert.cannot.email);
          },
        });
      }
    } else {
      this.showError(messages.me.profile.verify.alert.notValid.client.email);
    }
  }

  updateConfirmURL = (value) => {
    const { messages } = this.props.intl;
    let {inputConfirmURL, store} = this.state;

    if (!store){
      return;
    }

    store.confirm_url = inputConfirmURL;
    this.setState({store}, ()=>{
      this.modalConfirmURLRef.close();
    });
  }

  showLoading = () => {
    this.props.showLoading({message: '',});
  }

  hideLoading = () => {
    this.props.hideLoading();
  }

  get listCryptoCurrency() {
    const { messages } = this.props.intl;
    const { wallets, email, store_id } = this.state;


    if(wallets){
      return (<div className="cryptoCurrency">
      <div className="item header">
        <label>{messages.wallet.action.payment.label.crypto_currency}</label>
      </div>

      {
        email && store_id ?
          wallets.map(wallet => {
            let icon = '';
            try{ icon = require("@/assets/images/icon/wallet/coins/" + wallet.name.toLowerCase() + '.svg')} catch (ex){console.log(ex)};

            let w;
            if(wallet.name == 'ETH')
              w = new Ethereum();
            else
              w = new Bitcoin();

            w.address = wallet.address;

              return <div key={wallet.name + wallet.address} className="item">
                <img className="icon" src={icon} onClick={() => this.selectWallet(wallet)} />
                <div className="name" onClick={() => this.selectWallet(wallet)}>
                    <label>{w.address ? w.getShortAddress() : "<unset>"}</label>
                </div>
                {w.address && <div className="value" onClick={() => this.deleteWallet(wallet)}><img src={iconRemove} /></div>}
              </div>
            })
          :
          <div className="verify-first">Please verify <strong>Store ID</strong> and <strong>email</strong> first.</div>
      }


      </div>
      );
    }
  }

  formatUrl = (url) => {
    let result = '';
    if(url){

      try{
        let i = url.indexOf('//'), str = '';
        result = url;
        if(i > 0){
          str = url.substr(i+2);
          i = str.indexOf('/');
          if(i > 0){
            str = str.substr(0, i);
          }

          if(str){
            result = url.replace(str, '***');
          }
        }
      }
      catch(e){
        result = url;
      }
    }

    return result;
  }

  render() {
    const { messages } = this.props.intl;
    const { store, modalEmail, modalStoreID, modalConfirmURL, modalListCoin } = this.state;

    return (

        <div className="box-setting">

          <Modal title={messages.wallet.action.setting.label.select_alternative_currency} onRef={modal => this.modalSelectCurrencyRef = modal}>
            <div className="list-currency">
              {this.state.listCurrenciesContent}
            </div>
          </Modal>


          <Modal onClose={()=>{this.setState({modalEmail: ""})}} title="Email" onRef={modal => this.modalEmailRef = modal}>
            {modalEmail}
          </Modal>

          <Modal onClose={()=>{this.setState({modalStoreID: ""})}} title="Store ID" onRef={modal => this.modalStoreIDRef = modal}>
            {modalStoreID}
          </Modal>

          <Modal onClose={()=>{this.setState({modalConfirmURL: ""})}} title="Confirm URL" onRef={modal => this.modalConfirmURLRef = modal}>
            {modalConfirmURL}
          </Modal>

          <div className="wallets-wrapper">
            <Modal title="Select wallets" onClose={()=>{this.setState({modalListCoin: ""})}}  onRef={modal => this.modalListCoinRef = modal}>
              {modalListCoin}
            </Modal>
          </div>

          <div className="item1" onClick={()=> {this.openFormStoreID();}}>
            <div className="name">{messages.wallet.action.payment.label.store_id}</div>
            <div className="value">
              <span className="text">{store && store.store_id}</span>
            </div>
          </div>

          <div className="item1" onClick={()=> {this.openFormEmail();}}>
            <div className="name">{messages.wallet.action.payment.label.email}</div>
            <div className="value">
            <span className="text">{store && store.email}</span>
            </div>
          </div>

          <div className="item1" onClick={()=> {this.openFormConfirmURL();}}>
            <div className="name">{messages.wallet.action.payment.label.confirm_url}</div>
            <div className="value">
              <span className="text">{store && this.formatUrl(store.confirm_url)}</span>
            </div>
          </div>
          {this.listCryptoCurrency}
        </div>

    )
  }
}

const mapStateToProps = (state) => ({

});

const mapDispatch = ({
  setLanguage,
  showAlert,
  showLoading,
  hideLoading,
  storeUpdate,
  storeDetail,
  storeCreate
});


export default injectIntl(connect(mapStateToProps, mapDispatch)(Register));
