import React from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-bootstrap';
import {Bitcoin} from '@/models/Bitcoin.js'
import {Ethereum} from '@/models/Ethereum.js'
  import iconSent from '@/assets/images/icon/icon-sent.svg';
  import iconReceived from '@/assets/images/icon/icon-received.svg';

import PropTypes from 'prop-types';
import './Wallet.scss';
import WalletTransaction from './WalletTransaction';

import Button from '@/components/core/controls/Button';
import Checkbox from '@/components/core/forms/Checkbox/Checkbox';
import Modal from '@/components/core/controls/Modal';
import ModalDialog from '@/components/core/controls/ModalDialog';
import createForm from '@/components/core/form/createForm';
import { differenceWith } from 'lodash';

class WalletHistory extends React.Component {
	constructor(props) {

    super(props);
    this.state = {
      transactions: this.props.transactions,
      transaction_detail: false,
      transaction_time_stamp: 0
    };
  }

  componentDidUpdate(){console.log('componentDidUpdate', this.props);
    const {transactions} = this.props
    if (transactions != this.state.transactions){
      this.setState({transactions: transactions});
    }
  }

  get list_transaction() {
    console.log('list_transaction', this.props);
    const wallet = this.props.wallet;

    if (this.state.transactions.length==0)
      return <div className="history-no-trans">No transactions yet</div>;

      return this.state.transactions.map((tran) => {
        let cssLabel = `label-${tran.is_sent ? "sent" : "received"}`,
        cssValue = `value-${tran.is_sent ? "sent" : "received"}`;

        return (
        <div key={tran.transaction_no} className="row">
          <div className="col3">
            <div className="time">{tran.transaction_relative_time}</div>
            <div className={cssValue}>{tran.is_sent ? "-" : ""} {Number(tran.value)} {wallet.name}</div>
            {tran.confirmations <= 0 ? <div className="unconfirmation">Unconfirmed</div> : ""}
          </div>
          <div className="col1"><img className="iconDollar" src={tran.is_sent ? iconSent : iconReceived} /></div>
          <div className="col2 address">
            <div className={cssLabel}>{tran.is_sent ? "Sent" : "Received"}</div>
            {
              tran.addresses.map((addr) => {
                return <div key={addr}>{addr}</div>
              })
            }
          </div>

        </div>)
      });
  }

  async show_transaction(timeStamp, no){
    const wallet = this.props.wallet;

    if(wallet && no){
      this.modalTransactionRef.open();
      let transaction_detail =  await wallet.getTransactionDetail(no);
      this.setState({transaction_detail: transaction_detail, transaction_time_stamp: Number(timeStamp)});
    }
  }

  get detail_transaction() {
    const wallet = this.props.wallet;

    return (
      <Modal title="Transaction details" onRef={modal => this.modalTransactionRef = modal}>
        <WalletTransaction transaction_detail={this.state.transaction_detail} transaction_time_stamp={this.state.transaction_time_stamp}  />
      </Modal>
    );f

  }

	render(){
		return (
    <div>
      <div className="historywallet-wrapper">
        {this.list_transaction}
      </div>
      <div className="historywallet-wrapper">
        {this.detail_transaction}
      </div>
    </div>
		);
	}
}

WalletHistory.propTypes = {
  wallet: PropTypes.any,
  transactions: PropTypes.any
};

const mapState = (state) => ({

});

const mapDispatch = ({
});

export default connect(mapState, mapDispatch)(WalletHistory);
