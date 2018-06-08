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
const _ = require('lodash');
const moment = require('moment');

class WalletTransaction extends React.Component {
	constructor(props) {

    super(props);
    this.state = {
      wallet: props.wallet,
      transaction_detail: props.transaction_detail,
      transaction_time_stamp: props.transaction_time_stamp
    };
  }

  async componentDidUpdate(){
    const {transaction_detail, transaction_time_stamp}  = this.props;
    if (transaction_detail != this.state.transaction_detail){
        this.setState({transaction_detail: transaction_detail, transaction_time_stamp: transaction_time_stamp });
    }
  }

  get detail_transaction() {
    let detail = this.state.transaction_detail;
    return this.state.transaction_detail ?
    (
      <div className="transaction-detail-wrapper" >
        <div className="col1"><img className="iconDollar" src={detail.header.is_sent ? iconSent : iconReceived} /></div>
        <div className="col2">
          {detail.header.value} {detail.header.coin}<br />
          <span>{moment(this.state.transaction_time_stamp).format('llll')}</span>
        </div>
        <div className="confirmation">{detail.header.confirmations} Confirmations<br/>
          <span className="text-secondary">Please wait for least 12 confirmations to make sure your transaction is processed securely</span>
        </div>
        {
          Object.keys(detail.body).map((char) => {
            return (
              <div className="body" key={char }>
                <div className="key">{_.startCase(_.camelCase(char))}</div>
                <div className="value">{detail.body[char]}</div>
              </div>
            )
          })
        }
      </div>
    )
    : "";
  }

	render(){
		return (
      <div>
        {this.detail_transaction}
      </div>
		);
	}
}

WalletTransaction.propTypes = {
  transaction_detail: PropTypes.any,
  transaction_time_stamp: PropTypes.number
};

const mapState = (state) => ({

});

const mapDispatch = ({
});

export default connect(mapState, mapDispatch)(WalletTransaction);
