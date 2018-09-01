import React from 'react';
import { connect } from 'react-redux';
import {Ethereum} from '@/services/Wallets/Ethereum.js'
import iconSelf from '@/assets/images/icon/icon-self.svg';
import iconSent from '@/assets/images/icon/icon-sent.svg';
import iconCreate from '@/assets/images/icon/icon-create.svg';
import iconReceived from '@/assets/images/icon/icon-received.svg';
import PropTypes from 'prop-types';
import { injectIntl } from 'react-intl';
import './Wallet.scss';
import WalletTransaction from './WalletTransaction';
import { showLoading, hideLoading } from '@/reducers/app/action';
import Modal from '@/components/core/controls/Modal';
import {Tabs} from 'rmc-tabs';

import 'rmc-tabs/assets/index.css';

import imgNoTrans from '@/assets/images/wallet/images/no-transaction.svg';
import iconLoadding from '@/assets/images/icon/loading.gif';


class WalletHistory extends React.Component {
  static propTypes = {
    intl: PropTypes.object.isRequired,
  }

	constructor(props) {

    super(props);
    this.state = {
      transactions: this.props.transactions,
      internalTransactions: this.props.internalTransactions,
      transaction_detail: null,
      tabActive: 0,
    };
  }

  componentWillReceiveProps(){
    //this.setState({tabActive:0});
  }

  componentDidUpdate(){
    const {transactions, internalTransactions} = this.props
    if (transactions != this.state.transactions){
      this.setState({transactions: transactions});
    }

    if (internalTransactions != this.state.internalTransactions){
      this.setState({internalTransactions: internalTransactions, tabActive : 0});
    }
  }

  getNoTransactionYet(text){
    const wallet = this.props.wallet;
    return <div className="history-no-trans">    
      {wallet && !wallet.isLoading ?
        <div>
          <img src={imgNoTrans} />
          <div className="header-history-tx">{text}</div>
        </div>
        : <img className="icon-loading-history" src={iconLoadding} />}
    </div>
  }

  get list_transaction() {
    const wallet = this.props.wallet;
    const { messages } = this.props.intl;

    if (wallet && this.state.transactions.length==0)
      return this.getNoTransactionYet("No transactions yet");      
    else if(wallet){
      let arr = [];
      return this.state.transactions.map((res) => {
        let tran = wallet.cook(res);
        if(arr.indexOf(tran.transaction_no) < 0)
          arr.push(tran.transaction_no);
        else {
          tran.is_sent = 1;
          return "";
        }

        let cssLabel = "label-self", cssValue = "value-self", icon = iconSelf, label = messages.wallet.action.history.label.self;
        if(tran.is_sent == 1) {
          cssLabel = "label-sent";
          cssValue = "value-sent";
          label = messages.wallet.action.history.label.sent;
          icon = iconSent;
        }
        else if (tran.is_sent == 2) {
          cssLabel = "label-received";
          cssValue = "value-received";
          label = messages.wallet.action.history.label.received;
          icon = iconReceived;
        }
        else if (tran.is_sent == 3) {
          cssLabel = "label-create";
          cssValue = "value-create";
          label = messages.wallet.action.history.label.create;
          icon = iconCreate;
        }

        res.is_sent = tran.is_sent;

        return <div key={tran.transaction_no} className="row" onClick={() =>{this.detailTransaction(res)}}>
            <div className="col3">
              <div className="time">{tran.transaction_relative_time}</div>
              <div className={cssValue}>{tran.is_sent == 1 ? "-" : ""}{Number(tran.value)} {tran.coin_name}</div>
              {tran.confirmations <= 0 ? <div className="unconfirmation">{messages.wallet.action.history.label.unconfirmed}</div> : ""}
              {tran.is_error ? <div className="unconfirmation">{messages.wallet.action.history.label.failed}</div> : ""}
            </div>
            <div className="col1"><img className="iconDollar" src={icon} /></div>
            <div className="col2 history-address">
              <div className={cssLabel}>{label}</div>
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

  get list_internalTransaction() {
    const wallet = this.props.wallet;
    const { messages } = this.props.intl;

    if (wallet && this.state.internalTransactions.length==0)
      return this.getNoTransactionYet("No internal transactions yet");
    else if(wallet){
      let arr = [];

      return this.state.internalTransactions.map((res) => {
        let tran = wallet.cookIT(res);
        if(!tran) return "";

        if(arr.indexOf(tran.transaction_no) < 0)
          arr.push(tran.transaction_no);
        else {
          return "";
        }

        let cssLabel = "label-self", cssValue = "value-self", icon = iconSelf, label = messages.wallet.action.history.label.self;
        if(tran.is_sent == 1) {
          cssLabel = "label-sent";
          cssValue = "value-sent";
          label = messages.wallet.action.history.label.sent;
          icon = iconSent;
        }
        else if (tran.is_sent == 2) {
          cssLabel = "label-received";
          cssValue = "value-received";
          label = messages.wallet.action.history.label.received;
          icon = iconReceived;
        }
        else if (tran.is_sent == 3) {
          cssLabel = "label-create";
          cssValue = "value-create";
          label = messages.wallet.action.history.label.create;
          icon = iconCreate;
        }

        return <div key={tran.transaction_no} className="row" onClick={() =>{this.detailTransaction(res)}}>
            <div className="col3">
              <div className="time">{tran.transaction_relative_time}</div>
              <div className={cssValue}>{tran.is_sent == 1 ? "-" : ""}{Number(tran.value)} ETH</div>
              {tran.is_error ? <div className="unconfirmation">{messages.wallet.action.history.label.failed}</div> : ""}
            </div>
            <div className="col1"><img className="iconDollar" src={icon} /></div>
            <div className="col2 history-address">
              <div className={cssLabel}>{label}</div>
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

  async detailTransaction(data){
    const wallet = this.props.wallet;
    if(wallet && data){
      if(wallet.name == "ETH") {
        let it = await wallet.getInternalTransactions(data.hash);
        if(it && it.length > 0) data["internal_transactions"] = it;
      }

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
      <Modal iconBackImage={this.props.iconBackImage} modalHeaderStyle={this.props.modalHeaderStyle} title={messages.wallet.action.transaction.header} onRef={modal => this.modalTransactionRef = modal} onClose={this.closeDetail}>
        <WalletTransaction wallet={wallet} transaction_detail={this.state.transaction_detail}  />
      </Modal>
    );
  }

  get load_balance(){
    const wallet = this.props.wallet;
    const { messages } = this.props.intl;    
    if (wallet){
      var logo = require("@/assets/images/wallet/icons/coins/" + wallet.icon);      
      try { logo = require("@/assets/images/wallet/icons/coins/" + wallet.getCoinLogo());} catch (e){};
    }
    return wallet ?
    (
      <div className="clear-fix">
        <div className="wallet-detail"> 
          <div><img className="logo-detail" src={logo}/></div>
          <div className="balance">{wallet.balance} {wallet.name}</div>                  

          <div className="box-button">
            <div className="bt1"><button onClick={this.props.onTransferClick}>Send</button></div>
            <div className="bt2"><button onClick={this.props.onReceiveClick}>Receive</button></div>
          </div>
          {!wallet.protected ?
            <div className="box-warning" onClick={this.props.onWarningClick}>
            <span>⚠</span> {messages.wallet.action.protect.text.need_backup}
            </div>
          : ""}

        </div>

        {!wallet.isLoading && wallet.transaction_count > 0 ?
          <div className="header-history-tx">        
            {messages.wallet.action.history.label.transactions} : {wallet.transaction_count} <br/>
            {/* {messages.wallet.action.history.label.transactions}: {wallet.transaction_count}<br/> */}
            {wallet && wallet.name == "ETH" ?
              <a target="_blank" href={""+wallet.getAPIUrlAddress(this.state.tabActive)}>{messages.wallet.action.history.label.view_all_etherscan}</a>
              : ""
            }
          </div>
        :""}
        
        {/* <div className="history-balance">        
          {messages.wallet.action.history.label.transactions}: {wallet.transaction_count}<br/>
          {wallet && wallet.name == "ETH" ?
            <a target="_blank" href={""+wallet.getAPIUrlAddress(this.state.tabActive)}>{messages.wallet.action.history.label.view_all_etherscan}</a>
            : ""
          }
        </div> */}

          {/* {wallet && wallet.name == "ETH" && (this.state.internalTransactions && this.state.internalTransactions.length > 0) ?

            <ul className="history-tab">
              <li className={this.state.tabActive == 0 ? "active" : ""} onClick={() => this.setState({tabActive: 0})}>{messages.wallet.action.history.label.transactions}</li>
              <li className={this.state.tabActive == 1 ? "active" : ""} onClick={() => this.setState({tabActive: 1})}>{messages.wallet.action.history.label.internal_transactions}</li>
            </ul>
            : <ul className="history-tab"></ul>
          } */}
      </div>
    ) : "";
  }

	render(){
    const wallet = this.props.wallet;
    const { messages } = this.props.intl;    
		return (
    <div>
      <div className="historywallet-wrapper">
        {this.load_balance}

        {/* Not support render */}
        {wallet && wallet.isHistorySupport === false ?
          this.getNoTransactionYet("Coming soon ...")
        : 
          <div className="history-content">
            {wallet && (wallet.name == "ETH" || wallet.isToken) && (this.state.internalTransactions && this.state.internalTransactions.length > 0) ?
            <Tabs onChange={(tab, index) => this.setState({tabActive: index})} tabs={[
                { key: 't1', title: messages.wallet.action.history.label.transactions},
                { key: 't2', title: messages.wallet.action.history.label.internal_transactions},            
              ]} initalPage={'t1'}
              >
              <div key="t1">{this.list_internalTransaction}</div>
              <div key="t2">{this.list_transaction}</div>
            </Tabs>
            : 
            this.state.tabActive == 1 ? this.list_internalTransaction : this.list_transaction }
          
          </div>
        }
        
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
