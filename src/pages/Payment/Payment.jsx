import React from 'react';
import ReactDOM from 'react-dom';

import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';

// service, constant
import { Grid, Row, Col } from 'react-bootstrap';

// components
import Button from '@/components/core/controls/Button';
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

import TransferCoin from '@/components/Wallet/TransferCoin';
import Overview from './Overview';
import Header from './Header';
import ReactBottomsheet from 'react-bottomsheet';
import { setHeaderRight } from '@/reducers/app/action';
import { showAlert } from '@/reducers/app/action';
import { showLoading, hideLoading } from '@/reducers/app/action';
import local from '@/services/localStore';
import {APP} from '@/constants';
import _ from 'lodash';
import qs from 'querystring';


// style
import './Payment.scss';

class Payment extends React.Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      isLoading: false,
      isShowWallets: false,
      toAddress: "",
      fromAddress: "",
      coinName: "",
      amount: 0,
    };

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
    this.showAlert(mst, 'success', 4000, <img className="iconSuccessChecked" src={iconSuccessChecked} />);
  }
  showLoading(status) {
    this.props.showLoading({ message: '' });
  }
  hideLoading() {
    this.props.hideLoading();
  }

  async componentDidMount() {
    this.checkPayNinja();
  }

  checkPayNinja() {
    const querystring = window.location.search.replace('?', '');
    this.querystringParsed = qs.parse(querystring);
    const { order_id, amount, coin, ca, sa } = this.querystringParsed;
    if (order_id && amount && sa && coin) {
      this.setState({isShowWallets: true, toAddress: sa, fromAddress: ca, coinName: coin.toUpperCase(), orderID: order_id});
      console.log(ca);
      if (!isNaN(amount))
        this.setState({ amount: amount });

      this.modalSendRef.open();
    }
  }

  closePayNinja = () => {
    this.setState({ isShowWallets: false });
  }

  successPayNinja = () => {
    this.modalSendRef.close();
  }

  showPayNinja = () => {
    const { messages } = this.props.intl;
    return (
      <Modal title="Pay with Ninja" onRef={modal => this.modalSendRef = modal}  onClose={this.closePayNinja}>
        <div className="order-info">
          <div className="key">{this.state.orderID}</div>
          <div className="label">Order ID</div>
        </div>
        <div className="clearfix"></div>
        <TransferCoin isShowWallets={true} isShowWallets={true} toAddress={this.state.toAddress} fromAddress={this.state.fromAddress} amount={this.state.amount} coinName={this.state.coinName} onFinish={() => { this.successPayNinja() }} />
      </Modal>);
  }

  showOverview = () => {
    return(
      <Overview />
    )
  }

  render = () => {
    const { messages } = this.props.intl;
    return (

      <div>
        {
          this.showPayNinja()
        }
        {
          !this.state.isShowWallets ? this.showOverview() : ""
        }
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
  hideLoading
});


export default injectIntl(connect(mapState, mapDispatch)(Payment));
