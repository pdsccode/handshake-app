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
import iconSuccessChecked from '@/assets/images/icon/icon-checked-green.svg';

// style
import './ChooseCrypto.scss';


const nameFormSendWallet = 'sendWallet';
const SendWalletForm = createForm({ propsReduxForm: { form: nameFormSendWallet, enableReinitialize: true, clearSubmitErrors: true}});

class ChooseCrypto extends React.Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {

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

  }

  async componentDidMount() {
    let listWallet = await MasterWallet.getMasterWallet();

    if (listWallet == false) {
      listWallet = await MasterWallet.createMasterWallets();
      await this.splitWalletData(listWallet);
    } else {
      this.splitWalletData(listWallet);
    }
  }

  componentDidUpdate() {

  }

  splitWalletData(listWallet) {
    let mainCoin = {}, testCoin = {};

    listWallet.forEach(wallet => {

      if(wallet.isToken){ return; }

      // is Mainnet (coin, token, collectible)
      if (wallet.network === MasterWallet.ListCoin[wallet.className].Network.Mainnet) {
        let coin = mainCoin[wallet.name];
        if(!coin)
          mainCoin[wallet.name] = wallet;
        else{
          if(!coin.default && wallet.default){
            mainCoin[wallet.name] = wallet;
          }
        }
      } else {
        let coin = testCoin[wallet.name];
        if(!coin)
          testCoin[wallet.name] = wallet;
        else{
          if(!coin.default && wallet.default){
            testCoin[wallet.name] = wallet;
          }
        }
      }
    });

    //console.log(mainCoin, testCoin);
    this.setState({ mainCoin: mainCoin, testCoin: testCoin });
  }

  buildListWallet(){

  }

  showLoading = () => {
    this.props.showLoading({message: '',});
  }

  hideLoading = () => {
    this.props.hideLoading();
  }

  onFinish = (data) => {
    const { onFinish } = this.props;

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
        if(!wal.isCollectibles && !wal.isToken){
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

  get listMainCoin(){
    const main = this.state.mainCoin;
    if(main){
      let arr = [], icon = '';
      for(var i in main) {
        arr.push(main[i]);
      }

      return arr.map(e => {
        let icon = '';
        try{ icon = require("@/assets/images/icon/wallet/coins/" + e.name.toLowerCase() + '.svg')} catch (ex){console.log(ex)};
        console.log(icon);

        return <div className="coinName" key={e.name} onClick={this.selectCoin(e)} >
            <div className="icon"><img src={icon} /></div>
            <div className="balance">{e.balance} {e.name}</div>
            <div className="name">{e.className}</div>
          </div>
        }
      );
    }
  }

  get listTestCoin(){
    const test = this.state.testCoin;
    if(test){
      let arr = [];
      for(var i in test) {
        arr.push(test[i]);
      }

      return arr.map(e => {
        let icon = '';
        try{ icon = require("@/assets/images/icon/wallet/coins/" + e.name.toLowerCase() + '.svg')} catch (ex){console.log(ex)};

          return <div className="coinName test" key={e.name} onClick={()=> this.selectCoin(e)} >
            <div className="icon"><img src={icon} /></div>
            <div className="balance">{e.balance} {e.name}</div>
            <div className="name">{e.className}</div>
          </div>
        }
      );
    }

    return "";
  }

  selectCoin = (wallet) => {
    console.log(wallet);
  }

  render() {
    const { messages } = this.props.intl;
    return (
      <div>
        {this.listMainCoin}
        {this.listTestCoin}
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


export default injectIntl(connect(mapState, mapDispatch)(ChooseCrypto));
