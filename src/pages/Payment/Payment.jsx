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

import WalletPreferences from '@/components/Wallet/WalletPreferences';
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
      listShop: []
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
    //await this.addShop();
    let listShop = await this.getShops();
    this.setState({listShop});
  }

  getShops(){
    return new Promise((resolve, reject) => {

      this.props.storeList({
        PATH_URL: `store/list`,
        METHOD: 'GET',
        successFn: (data) => {
          if (data.status) {
            console.log(data.data);
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

  addShop = (confirmUrl, storeId, storeName) => {
    const params = new URLSearchParams();
    params.append('wallets_receive', JSON.stringify([{BTC: 'muU86kcQGfJUydQ9uZmfJwcDRb1H5PQuzr'}, {ETH: '0x1c0abE5b12257451DDcbe51f53f3F888dde32842'}]));
    params.append('confirm_url', confirmUrl);
    params.append('store_id', storeId);
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

  get showListShops() {
    return this.state.listShops.map(wallet => <WalletItem key={Math.random()} settingWallet={setting} wallet={wallet} onMoreClick={() => this.onMoreClick(wallet)} onWarningClick={() => this.onWarningClick(wallet)} onAddressClick={() => this.onAddressClick(wallet)} />);
  }

  render = () => {
    const { messages } = this.props.intl;
    const { formAddTokenIsActive, formAddCollectibleIsActive, modalBuyCoin, modalTransferCoin, modalSetting,
      modalHistory, modalRemindCheckout, modalWalletPreferences, modalReceiveCoin, walletSelected, walletsData, backupWalletContent, restoreWalletContent} = this.state;

    return (
      <div className="payment-page">
        <div className="header-payment">
            <img className="logo-payment" src={logoWallet} />
            <div className="header-right"><img src={iconMoreSettings} /></div>
        </div>

        <Row className="payment-box">
          <Row className="list">
            <Header icon2={iconAlignJust} onIcon2Click={this.updateSortableForCoin} icon={iconAddPlus} title={messages.wallet.action.create.label.header_coins} hasLink={true} linkTitle={messages.wallet.action.create.button.add_new} onLinkClick={this.showModalAddCoin} />
          </Row>
          <Row className="list">
            {this.showListShops}
          </Row>
        </Row>
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
