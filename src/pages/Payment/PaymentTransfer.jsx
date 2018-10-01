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
import TransferToken from '@/components/Wallet/TransferToken';
import { setHeaderRight } from '@/reducers/app/action';
import { showAlert } from '@/reducers/app/action';
import { showLoading, hideLoading } from '@/reducers/app/action';
import local from '@/services/localStore';
import {APP} from '@/constants';
import _ from 'lodash';
import qs from 'querystring';


class PaymentTransfer extends React.Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props);

    this.state = {
      msgError: '',
      modalTransfer: ''
    };
  }

  componentDidMount() {
    this.getTokenData();
  }

  async getTokenData() {
    const querystring = window.location.search.replace('?', '');
    this.querystringParsed = qs.parse(querystring);
    let { to:toAddress, amount, gas_limit:gasLimit , data, confirm_url } = this.querystringParsed;

    if (!toAddress && !amount && !data) {
      this.showModalError("Missing parameters");
      return;
    }

    console.log(toAddress, amount);
    this.setState({
      modalTransfer: <TransferToken
        toAddress={toAddress}
        amount={amount}
        gasLimit={gasLimit}
      />
      }, () => {
        this.modalTransferRef.open();
      }
    );
  }

  showModalError = (msg) => {
    this.setState({msgError: msg}, ()=> {
      this.modalErrorRef.open();
    });
  }


  render = () => {
    const { messages } = this.props.intl;
    const { modalTransfer } = this.state;

    return (
      <div className="wallet-transfer">

        <Modal title="Transfer Token" onRef={modal => this.modalTransferRef = modal}  onClose={() => this.closeTransfer()}>
          {modalTransfer}
        </Modal>

        <Modal title="Error" onRef={modal => this.modalErrorRef = modal}>
          <div className="msg-error">{this.state.msgError}</div>
        </Modal>

        <div style={{width: "100%"}}>
          Test
        </div>
      </div>
    );
  }
}

const mapState = (state) => ({

});

const mapDispatch = ({
  showAlert,
  showLoading,
  hideLoading,
  change,
  clearFields,
});


export default injectIntl(connect(mapState, mapDispatch)(PaymentTransfer));
