import React from 'react';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-bootstrap';
import {Bitcoin} from '@/models/Bitcoin.js'
import {Ethereum} from '@/models/Ethereum.js'
import iconSent from '@/assets/images/icon/icon-sent.svg';
import iconReceived from '@/assets/images/icon/icon-received.svg';

import PropTypes from 'prop-types';
import './Wallet.scss';

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
      transactions: this.props.transactions
    };
  }

  componentDidUpdate(){
    const {transactions} = this.props
    if (transactions != this.state.transactions){        
        this.setState({transactions: transactions});
    }
  }

  get list_transaction() {

    const wallet = this.props.wallet;
    
      console.log("list_transaction", this.props.transactions);
      return this.state.transactions.map((tran) => {
        let cssLabel = `label-${tran.is_sent ? "sent" : "received"}`,
        cssValue = `value-${tran.is_sent ? "sent" : "received"}`;

        return (
        <div key={tran.transaction_date} className="row">
          <div className="col3">
            <div className="time">{tran.transaction_relative_time}</div>
            <div className={cssValue}>{tran.is_sent ? "-" : ""} {Number(tran.value)} {wallet.name}</div>
          </div>
          <div className="col1"><img className="iconDollar" src={tran.is_sent ? iconSent : iconReceived} /></div>
          <div className="col2 address">
            <div className={cssLabel}>{tran.is_sent ? "Sent" : "Received"}</div>
            <div className="">{wallet.getShortAddress()}</div>
          </div>

        </div>)
      });
  }

	render(){    
		return (
      <div className="historywallet-wrapper">
        {
          this.list_transaction
        }
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
