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
import {required} from '@/components/core/form/validation';
import {change, Field, formValueSelector, clearFields} from 'redux-form';
import {bindActionCreators} from 'redux';
import ModalDialog from '@/components/core/controls/ModalDialog';
import Modal from '@/components/core/controls/Modal';
import Dropdown from '@/components/core/controls/Dropdown';
import createForm from '@/components/core/form/createForm';

import Header from './Header';
import HeaderMore from './HeaderMore';
import WalletItem from './WalletItem';
import WalletProtect from './WalletProtect';
import WalletHistory from './WalletHistory';
import TransferCoin from '@/components/Wallet/TransferCoin';
import ReceiveCoin from '@/components/Wallet/ReceiveCoin';
import ReactBottomsheet from 'react-bottomsheet';
import { setHeaderRight } from '@/reducers/app/action';
import QrReader from 'react-qr-reader';
import { showAlert } from '@/reducers/app/action';
import { showLoading, hideLoading } from '@/reducers/app/action';
import local from '@/services/localStore';
import {APP} from '@/constants';
import _ from 'lodash';
import qs from 'querystring';
import axios from 'axios';

import AddToken from '@/components/Wallet/AddToken/AddToken';
import AddCollectible from '@/components/Wallet/AddCollectible/AddCollectible';

// style
import './Wallet.scss';
import './BottomSheet.scss';
import { hideHeader } from '@/reducers/app/action';
import { requestWalletPasscode  } from '@/reducers/app/action';


const isIOs = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);

const nameFormSendWallet = 'sendWallet';

class WalletTransfer extends React.Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.props.hideHeader();
    this.modalHeaderStyle = {color: "#fff", background: "#546FF7"};
    this.modalBodyStyle = {padding: 0};

    this.state = {
    };

  }


  render = () => {
    const { messages } = this.props.intl;
    const {  } = this.state;

    return (
      <div className="wallet-page">
        hello the world
      </div>
    );
  }
}

const mapState = (state) => ({
  cryptoPrice: state.exchange.cryptoPrice,
  userCcLimit: state.exchange.userCcLimit,
  ccLimits: state.exchange.ccLimits,
});

const mapDispatch = ({
  setHeaderRight,
  showAlert,
  showLoading,
  hideLoading,
  change,
  clearFields,
  hideHeader,
  requestWalletPasscode
});


export default injectIntl(connect(mapState, mapDispatch)(WalletTransfer));
