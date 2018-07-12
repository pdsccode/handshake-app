import React from 'react';
import { connect } from 'react-redux';
import {Ethereum} from '@/services/Wallets/Ethereum.js'
import iconSent from '@/assets/images/icon/icon-sent.svg';
import iconReceived from '@/assets/images/icon/icon-received.svg';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import './Wallet.scss';
import WalletTransaction from './WalletTransaction';
import { showLoading, hideLoading } from '@/reducers/app/action';
import Modal from '@/components/core/controls/Modal';

class WalletHistory extends React.Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
  }

	constructor(props) {

    super(props);
    this.state = {
      transactions: this.props.transactions,
      transaction_detail: null
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
    const { messages } = this.props.intl;

    if (wallet && this.state.transactions.length==0)
      return <div className="history-no-trans">No transactions yet</div>;
    else if(wallet){
      let arr = [];

      return this.state.transactions.map((res) => {
        let tran = wallet.cook(res);
        if(arr.indexOf(tran.transaction_no) < 0)
          arr.push(tran.transaction_no);
        else
          tran.is_sent = true;

        let cssLabel = `label-${tran.is_sent ? "sent" : "received"}`,
          cssValue = `value-${tran.is_sent ? "sent" : "received"}`;
        res.is_sent = tran.is_sent;

        return <div key={tran.transaction_no} className="row" onClick={() =>{this.show_transaction(res)}}>
            <div className="col3">
              <div className="time">{tran.transaction_relative_time}</div>
              <div className={cssValue}>{tran.is_sent ? "-" : ""} {Number(tran.value)} {tran.coin_name}</div>
              {tran.confirmations <= 0 ? <div className="unconfirmation">{messages.wallet.action.history.label.unconfirmed}</div> : ""}
              {tran.is_error ? <div className="unconfirmation">{messages.wallet.action.history.label.failed}</div> : ""}
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
          </div>
      });
    }
  }

  closeDetail = () => {
    this.setState({ transaction_detail: null });
  }

  showLoading(status) {
    this.props.showLoading({ message: '' });
  }
  hideLoading() {
    this.props.hideLoading();
  }

  async show_transaction(data){
    const wallet = this.props.wallet;
    if(wallet && data){
      this.modalTransactionRef.open();
      this.showLoading();
      this.setState({transaction_detail: data});
      this.hideLoading();
    }
  }

  get detail_transaction() {
    const wallet = this.props.wallet;
    const { messages } = this.props.intl;

    return (
      <Modal title={messages.wallet.action.transaction.header} onRef={modal => this.modalTransactionRef = modal} onClose={this.closeDetail}>
        <WalletTransaction wallet={wallet} transaction_detail={this.state.transaction_detail}  />
      </Modal>
    );
  }

  get load_balance(){
    const wallet = this.props.wallet;
    const { messages } = this.props.intl;

    return wallet ?
    (
      <div>
        <div className="history-balance">
          {wallet.name == "ETH" ?
            <div className="float-right"><a target="_blank" href={"https://etherscan.io/address/"+wallet.address}>{messages.wallet.action.history.label.view_all_etherscan}</a></div>
            : ""
          }
          {messages.wallet.action.history.label.transactions}: {wallet.transaction_count}
          <br/>
          {messages.wallet.action.history.label.balance}: {wallet.balance} {wallet.name}

        </div>
      </div>
    ) : "";
  }

	render(){
		return (
    <div>
      <div className="historywallet-wrapper">
        {this.load_balance}
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
  transactions: PropTypes.array
};

const mapState = (state) => ({

});

const mapDispatch = ({
  showLoading,
  hideLoading,
});

export default injectIntl(connect(mapState, mapDispatch)(WalletHistory));
