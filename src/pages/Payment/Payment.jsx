import React from 'react';
import ReactDOM from 'react-dom';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

// service, constant
import { Grid, Row, Col } from 'react-bootstrap';

// components
import Button from '@/components/core/controls/Button';
import { MasterWallet } from '@/services/Wallets/MasterWallet';
import Input from '@/components/core/forms/Input/Input';
import { StringHelper } from '@/services/helper';

import {
  fieldCleave,
  fieldDropdown,
  fieldInput,
  fieldNumericInput,
  fieldPhoneInput,
  fieldRadioButton
} from '@/components/core/form/customField';
import {change, Field, formValueSelector, clearFields} from 'redux-form';
import ModalDialog from '@/components/core/controls/ModalDialog';
import Modal from '@/components/core/controls/Modal';

import Header from './Header';
import HeaderMore from './HeaderMore';
import ReactBottomsheet from 'react-bottomsheet';
import { showLoading, hideLoading, showAlert, setHeaderRight } from '@/reducers/app/action';
import local from '@/services/localStore';
import {APP} from '@/constants';


// style
import './Payment.scss';
import '../Wallet/BottomSheet.scss';

import logoWallet from '@/assets/images/wallet/images/logo-wallet.svg';
import iconMoreSettings from '@/assets/images/wallet/icons/icon-more-settings.svg';
import iconAddPlus from '@/assets/images/wallet/icons/icon-add-plus.svg';
import iconAlignJust from '@/assets/images/wallet/icons/icon-align-just.svg';
import { hideHeader } from '@/reducers/app/action';

import Register from '@/components/Payment/Register';
import { requestWalletPasscode, showScanQRCode, showQRCodeContent  } from '@/reducers/app/action';
import QRCodeContent from '@/components/Wallet/QRCodeContent';
import Redeem from '@/components/Wallet/Redeem';
import RemindPayment from '@/components/Payment/Remind';
import { ICON } from '@/styles/images';
import { storeList, storeUpdate, storeDetail, storeCreate } from '@/reducers/auth/action';

const defaultOffset = 500;

var topOfElement = function(element) {
  if (!element) {
      return 0;
  }
  return element.offsetTop + topOfElement(element.offsetParent);
};

class Payment extends React.Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
    hideHeader: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.props.hideHeader();
    this.modalHeaderStyle = {color: "#fff", background: "#546FF7"};
    this.modalBodyStyle = {padding: 0};

    this.state = {
      listShop: [],
      modalRegister: ''
    };

    this.props.setHeaderRight(this.headerRight());
    // this.listener = _.throttle(this.scrollListener, 200).bind(this);
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
    this.showAlert(mst, 'success', 4000, ICON.SuccessChecked());
  }
  headerRight() {
    return (<HeaderMore onHeaderMoreClick={this.onIconRightHeaderClick} />);
  }

  async componentDidMount() {
    // await this.updateShop(7, 1, "http://www.autonomous.ai", "jason", "Son Durex Shop");
    // await this.updateShop(6, 1, "http://www.autonomous.ai", "phuong", "Phuong Nepture OK");
    // await this.addShop("http://www.autonomous.ai", "sam", "Sam Kim Chi", "sam@autonomous.ai");
    this.props.showLoading();
    let listShop = await this.getShop();
    this.setState({listShop});
    this.props.hideLoading();
  }

  showAddShop = () =>{
    this.setState({
      modalRegister: <Register
      />
      }, () => {
        this.modalRegisterRef.open();
      }
    );
  }

  getShop(){
    return new Promise((resolve, reject) => {

      this.props.storeList({
        PATH_URL: `store/list`,
        METHOD: 'GET',
        successFn: (data) => {
          if (data.status) {
            resolve(data.data);
          }
        },
        errorFn: (e) => {
          this.showError(`Error ${e && e.message}`);
          resolve(false);
        },
      });
    });
  }

  addShop = (confirmUrl, storeId, storeName, receive_email) => {
    const params = new URLSearchParams();
    params.append('wallets_receive', JSON.stringify([{name: 'BTC', address: 'muU86kcQGfJUydQ9uZmfJwcDRb1H5PQuzr'}, {name: 'ETH', address: '0x1c0abE5b12257451DDcbe51f53f3F888dde32842'}]));params.append('wallet_receive', JSON.stringify([{name: 'BTC', address: 'muU86kcQGfJUydQ9uZmfJwcDRb1H5PQuzr'}, {name: 'ETH', address: '0x1c0abE5b12257451DDcbe51f53f3F888dde32842'}]));
    params.append('confirm_url', confirmUrl);
    params.append('store_id', storeId);
    params.append('receive_email', receive_email);
    params.append('store_name', storeName);

    this.props.storeCreate({
      PATH_URL: `store/create`,
      data: params,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      METHOD: 'POST',
      successFn: (data) => {
        if (data.status) {
          console.log(data);
        }
      },
      errorFn: (e) => {
        this.showError(`Error ${e && e.message}`);
      },
    });
  }

  updateShop = (id, status, confirmUrl, storeId, storeName, receive_email) => {
    const params = new URLSearchParams();
    params.append('wallets_receive', JSON.stringify([{name: 'BTC', address: 'muU86kcQGfJUydQ9uZmfJwcDRb1H5PQuzr'}, {name: 'XRP', address: 'muU86kcQGfJUydQ9uZmfJwcDRb1H5PQuzr'}, {name: 'BCH', address: 'muU86kcQGfJUydQ9uZmfJwcDRb1H5PQuzr'}, {name: 'ETH', address: '0x1c0abE5b12257451DDcbe51f53f3F888dde32842'}]));
    params.append('confirm_url', confirmUrl);
    params.append('store_id', storeId);
    params.append('store_name', storeName);
    params.append('status', status);
    params.append('id', id);

    this.props.storeCreate({
      PATH_URL: `store/update`,
      data: params,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      METHOD: 'POST',
      successFn: (data) => {
        if (data.status) {
          console.log(data);
        }
      },
      errorFn: (e) => {
        this.showError(`Error ${e && e.message}`);
      },
    });
  }

  get showListShop() {
    const listShop = this.state.listShop;//console.log('showListShop', listShop)
    return listShop && listShop.map(shop => {
      let wallets = [];
      try{
        if(shop.wallets_receive)
          wallets = JSON.parse(shop.wallets_receive);
      }
      catch(e){
        console.log('showListShop', e)
      }

      return (<div className="item" key={shop.id}>
        <div className="item-left">
          <div className="store-id">{shop.store_id}</div>
          <span className="store-name">{shop.store_name}</span>
        </div>
        <div className="item-right">
          {
            wallets && wallets.map(wallet => {
              let icon = '';
              try{ icon = wallet.name && require("@/assets/images/icon/wallet/coins/" + wallet.name.toLowerCase() + '.svg')} catch (ex){console.log(ex)};

              return (<img src={icon} key={wallet.name} />)
            })
          }
          {/* {ICON.ExternalLink("Silver", "1x")} */}
        </div>
      </div>)
    });
  }

  render = () => {
    const { messages } = this.props.intl;
    const { modalRegister } = this.state;

    return (
      <div className="payment-page">
        <div className="header-payment">
            <img className="logo-payment" src={logoWallet} />
            <div className="header-right"><img src={iconMoreSettings} /></div>
        </div>

        <Row className="payment-box">
          <Row className="list">
            <Header icon2={iconAlignJust} onIcon2Click={this.updateSortableForCoin} icon={iconAddPlus} title={messages.wallet.action.payment.label.shops} hasLink={true} linkTitle={messages.wallet.action.create.button.add_new} onLinkClick={this.showAddShop} />
          </Row>
          <Row className="list shop-list">
            {this.showListShop}
          </Row>
        </Row>

         <Modal title="Register" onRef={modal => this.modalRegisterRef = modal} onClose={() => this.setState({modalRegister: ''})}>
            {modalRegister}
          </Modal>
      </div>
    );
  }
}

const mapState = (state) => ({

});

const mapDispatch = ({
  setHeaderRight,
  showAlert,
  showLoading,
  hideLoading,
  change,
  clearFields,
  hideHeader,
  storeList,
  storeCreate,
});


export default injectIntl(connect(mapState, mapDispatch)(Payment));
