import React from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-bootstrap';
import {Bitcoin} from '@/models/Bitcoin.js'
import {Ethereum} from '@/models/Ethereum.js'
import dontIcon from '@/assets/images/icon/3-dot-icon.svg';
import iconSafe from '@/assets/images/icon/icon-safe.svg';
import iconWarning from '@/assets/images/icon/icon-warning.svg';

import PropTypes from 'prop-types';
import './Wallet.scss';

import Button from '@/components/core/controls/Button';
import Checkbox from '@/components/core/forms/Checkbox/Checkbox';
import Modal from '@/components/core/controls/Modal';
import ModalDialog from '@/components/core/controls/ModalDialog';
import createForm from '@/components/core/form/createForm';
import { differenceWith } from 'lodash';

const testnet = 'https://test-insight.bitpay.com/api';
var btcTestnet = new Bitcoin(testnet);

class WalletHistory extends React.Component {
	constructor(props) {

    super(props);
    this.state = {
      transactions: [],
    };
  }

	async componentDidMount() {
    const {wallet} = this.props;
    console.log("componentDidMount", wallet);
    if(wallet){
      wallet.address = "muU86kcQGfJUydQ9uZmfJwcDRb1H5PQuzr"; //testing
      this.setState({transactions: await wallet.getTransactionHistory()});
      console.log("transactions1", transactions);
    }
	}

  get show_header() {
    const {wallet} = this.props;

    if(wallet){
      return (
      <div id="hw-header" className="row">
        <div className="name col-sm-8 p-1">{wallet.name}</div>
        <div className="balance text-primary col-sm-4 p-1">{wallet.balance} {wallet.name}</div>
        <div className="address">{wallet.address}</div>
      </div>);
    }
    else
      return "";
  }


  get list_transaction() {
    const {wallet} = this.props;
    if(wallet){

      return this.state.transactions.map((tran) => {
        return
        <div className="card bg-light">
          <div className="balance">{wallet.balance} {wallet.name}</div>
          <div className="name">{wallet.name}</div>
          <div className="address">{wallet.address}</div>
        </div>
      });

      return this.state.transactions.map((tran) => {
        return
        <div className="card bg-light">
          <div className="balance">{wallet.balance} {wallet.name}</div>
          <div className="name">{wallet.name}</div>
          <div className="address">{wallet.address}</div>
        </div>
      });
    }
    else
      return "";
  }

	render(){
    const {wallet} = this.props;

		return (
      <div class="historywallet-wrapper">
        {this.show_header}
        {this.list_transaction}
      </div>
		);
	}
}

WalletHistory.propTypes = {
  wallet: PropTypes.object
};

const mapState = (state) => ({

});

const mapDispatch = ({
});

export default connect(mapState, mapDispatch)(WalletHistory);
