import React from 'react';
import PropTypes from 'prop-types';
import {injectIntl} from 'react-intl';
import {Field, clearFields, change} from "redux-form";
import {connect} from "react-redux";
import Button from '@/components/core/controls/Button';
import ModalDialog from '@/components/core/controls/ModalDialog';
import Modal from '@/components/core/controls/Modal';
import createForm from '@/components/core/form/createForm'
import {fieldDropdown, fieldInput} from '@/components/core/form/customField'
import { API_URL } from "@/constants";
import local from '@/services/localStore';
import {APP} from '@/constants';
import {required} from '@/components/core/form/validation'
import {MasterWallet} from "@/services/Wallets/MasterWallet";
import { bindActionCreators } from "redux";
import {showAlert} from '@/reducers/app/action';
import {getFiatCurrency} from '@/reducers/exchange/action';
import { showLoading, hideLoading } from '@/reducers/app/action';
import QrReader from 'react-qr-reader';
import { StringHelper } from '@/services/helper';
import iconSuccessChecked from '@/assets/images/icon/icon-checked-green.svg';
import iconQRCodeBlack from '@/assets/images/wallet/icons/icon-qrcode-black.svg';
import iconQRCodeWhite from '@/assets/images/wallet/icons/icon-qrcode-white.svg';
import iconSelected from '@/assets/images/pages/payment/check-circle-solid.svg';
import './ListCoin.scss';

import BrowserDetect from '@/services/browser-detect';
import { left } from 'glamor';

class ListCoin extends React.Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    walletSelected: PropTypes.any,
    wallets: PropTypes.any,
    crypto: PropTypes.string
  }

  static defaultProps = {
    wallets: null,
    walletSelected: null,
    crypto: null,
  };

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


  componentDidMount() {
    let { walletSelected, wallets, crypto } = this.props;
    this.showLoading();
    if(!wallets){
      wallets = this.getWallets();
    }

    this.setState({wallets, walletSelected}, ()=> {this.hideLoading() });
  }

  getWallets = async () => {
    const { walletSelected, crypto } = this.props;
    let walletDefault = walletSelected;

    if(!walletDefault)
      walletDefault = await MasterWallet.getWalletDefault(crypto);

    let wallets = MasterWallet.getWallets(crypto);

    // set name + text for list:
    let listWalletCoin = [];
    if (wallets.length > 0){
      for(let wal of wallets){
        if(!wal.isCollectibles){
          wal.text = wal.getShortAddress() + " (" + wal.name + "-" + wal.getNetworkName() + ")";
          if (process.env.isLive){
            wal.text = wal.getShortAddress() + " (" + wal.className + " " + wal.name + ")";
          }
          wal.id = wal.address + "-" + wal.getNetworkName() + wal.name;

          wal.balance = wal.formatNumber(await wal.getBalance());
          listWalletCoin.push(wal);
        }
      }
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
      this.setState({walletSelected: walletDefault});
      MasterWallet.UpdateBalanceItem(walletDefault);
    }

    this.setState({wallets: listWalletCoin, walletSelected: walletDefault}, ()=>{
      this.hideLoading();
    });
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

  selectCoin(crypto){
    const { callbackSuccess } = this.props;

    if (callbackSuccess) {
      callbackSuccess(crypto);
    }
  }

  get showListCoin(){
    const { wallets, walletSelected } = this.state;
    if(wallets){
      return wallets.map(e => {
        let icon = '';
        try{ icon = require("@/assets/images/icon/wallet/coins/" + e.name.toLowerCase() + '.svg')} catch (ex){console.log(ex)};
        let isLive = e.network === MasterWallet.ListCoin[e.className].Network.Mainnet;
        let isSelected = walletSelected && e.network == walletSelected.network && e.address == walletSelected.address;

        return <div className={"coinName " + (!isLive && " test") + (isSelected ? " selected" : "")} key={e.address} onClick={this.selectCoin(e)} >
            <div className="row">
              <div className="col-2 icon"><img src={isSelected ? iconSelected : icon} /></div>
              <div className="col-5">
                <div className="name">{e.title}</div>
                <div className="address">{e.getShortAddress()}</div>
              </div>
              <div className="col-5 text-right pr-3">
                <div className="balance">{e.balance} {e.name}</div>
                <div><img src={isSelected ? iconQRCodeWhite : iconQRCodeBlack} /></div>
              </div>
            </div>
          </div>
        }
      );
    }
  }

  render() {

    const { messages } = this.props.intl;
    return (
      <div className="listCoin">
        {this.showListCoin}
      </div>
    )
  }
}



const mapStateToProps = (state) => ({

});

const mapDispatchToProps = (dispatch) => ({
  showLoading: bindActionCreators(showLoading, dispatch),
  hideLoading: bindActionCreators(hideLoading, dispatch),
});

export default injectIntl(connect(mapStateToProps, mapDispatchToProps)(ListCoin));
