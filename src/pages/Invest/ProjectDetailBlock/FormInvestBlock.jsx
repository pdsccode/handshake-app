import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetch_project_detail, getNumberOfFund, getSMProjectInfo, getFundAmount, getImageUrl, toHexColor, withdrawFund } from '@/reducers/invest/action';
import { Grid, Row, Col, ProgressBar ,Button } from 'react-bootstrap';
import _ from 'lodash';
import '../ProjectList.scss';
import { InputGroup, InputGroupAddon, Input } from 'reactstrap';
import HedgeFundAPI from '../contracts/HedgeFundAPI';
import { MasterWallet } from '../../../services/Wallets/MasterWallet';
import iconBitcoin from '@/assets/images/icon/coin/btc.svg';
import iconEthereum from '@/assets/images/icon/coin/eth.svg';
import iconUsd from '@/assets/images/icon/coin/icons8-us_dollar.svg';
import LoadingGif from '../loading.svg'; 
import createForm from '@/components/core/form/createForm';
// Refer to FeedCreditCard.jsx
const etherScanTxUrl = 'https://rinkeby.etherscan.io/tx';
const linkToEtherScan = (tx) => `${etherScanTxUrl}/${tx}`;
const transformString = str => str.substring(0, 2) + '..'+ str.substring(str.length-2, str.length);
import TransactionStorage from '../../../reducers/invest/transactions';
export const CRYPTO_ICONS = {
    ETH: iconEthereum,
    BTC: iconBitcoin,
    USDT: iconUsd,
  };
  
  
  const CRYPTO_CURRENCY_INVEST = {
    USDT: 'USDT',
    BTC: 'BTC',
    ETH: 'ETH',
  };
  const CRYPTO_CURRENCY_NAME = [
    'USDT',
    'BTC',
    'ETH',
  ];

  
const FormInvest = createForm({
    propsReduxForm: {
      form: 'FormInvest',
    },
  });
  
  const ModalBlock = (props) => (
    <div className='project-modal'>
      <div className='project-modal-content'>
        {props.children}
      </div>
    </div>
  );

export default class FormInvestBlock extends Component {
    constructor(props) {
      super(props);
      this.state = {
        investAmount: 0,
        isUserConfirmed: false,
        iSubmitted: false,
        estimateGasValue: null,
        txHashs: [],
      }
      this.hedgeFundApi = new  HedgeFundAPI('latest', false);
      this.runTrx = null;
      this.trxStorage = new TransactionStorage(props.pid);
      this.updateTrxState = null;
    }
  
    onFinishedTrx = (hash) => this.setState({
      isSubmitted: false,
      estimateGasValue: null,
      investAmount: 0,
      isUserConfirmed: false,
      txHashs: [...this.state.txHashs, { hash, status: 'Pending' }]
    })
  
    onChangeStatusTrx = (hash) => {
      this.updateTrxState = setTimeout(() => {
        const txHashs = this.state.txHashs.map(e => e.hash === hash ? ({ hash: e.hash, status: 'Done' }) : e);
        this.setState({ txHashs });
        console.log('update state status trx');
        this.props.onSuccess();
      }, 3000);
    }

    componentWillUnmount = () => {
      console.log('clear timeout');
      clearTimeout(this.updateTrxState)
    }
    onChangeAmount = (e) => this.setState({ investAmount: e.target.value })
  
    onSubmitInvest = async () => {
      this.setState({ isSubmitted: true });
      if (!this.props.pid) {
        alert('Project ID doesnt existed');
        return;
      }
      const wallets = MasterWallet.getWalletDefault();
      const { balance, privateKey } = wallets.ETH || {};
      const investAmount = Number(this.state.investAmount);
      const totalBalance = Number(balance);
      if (totalBalance <= investAmount) {
        alert(`You dont have enough eth. Please invest amount less than ${balance}`);
        return;
      }
      const { run, estimateGas } = await this.hedgeFundApi.fundProject(privateKey, '' + investAmount, '0x' + this.props.pid) || {};
      const estimateGasValue = await estimateGas();
      this.setState({ estimateGasValue });
      this.runTrx = run;
    }
    handleConfirmTransaction = () => {
      this.setState({ isUserConfirmed: true });
      this.runTrx().on('transactionHash', (hash) => {
        this.trxStorage.addTransaction({ hash, status: 'PENDING', type: 'SEND', amount: this.state.investAmount });
        console.log(this.trxStorage.getTransactions());
        console.log('txhash', hash);
        this.onFinishedTrx(hash);
        this.props.onSuccess();
      }).on('receipt', (receipt) => {
        this.onChangeStatusTrx(receipt.transactionHash);
        const { transactionHash: hash } = receipt;
        const status = 'DONE';
        this.trxStorage.updateTransaction({ hash, status });
      }).on('error', err => console.log('err', err));
    }
    render() {
      return (
        <div className="invest-button-form-block">
          <FormInvest>
            <label htmlFor="amountfield" className="fund-label">Amount to invest</label>
            <InputGroup className="inputGroupInvestButton">
              <Input value={this.state.investAmount} onChange={this.onChangeAmount} placeholder="Enter Quantity" type="number" className="inputGroupInvestField" />
              <InputGroupAddon addonType="append"className="inputGroupInvestIcon"><img src={CRYPTO_ICONS[CRYPTO_CURRENCY_NAME[0]]} width={24} alt="icon" /></InputGroupAddon>
            </InputGroup>
            <Button disabled={this.state.iSubmitted} className="invest-submit-button" size="lg" onClick={this.onSubmitInvest}>Invest now</Button>{' '}
          </FormInvest>
          {this.state.isSubmitted && <ModalBlock>
            {!this.state.estimateGasValue &&
              <div style={{ display: 'flex', justifyContent: 'center' }}>
                <img src={LoadingGif} style={{ width: '50px', height: '50px' }} />
              </div>}
            {this.state.estimateGasValue && <div>
              <div style={{ textAlign: 'center' }}>{`Gas Fee: ${this.state.estimateGasValue}`}</div>
              <button disabled={this.state.isUserConfirmed} style={{ display: 'block', width: '100%', backgroundColor: '#546FF7', color: '#fff', fontWeight: 500, padding: '10px' }} onClick={this.handleConfirmTransaction}>Confirm</button>
            </div>}
          </ModalBlock>}
          {/* {this.trxStorage.getTransactions().length > 0 && <div className="trxHistory">
            <div className="trxHistory-row">
              <div className="trxHistory-row-left fund-label-row-header">Trx</div>
              <div className="trxHistory-row-mid fund-label-row-header">Type</div>
              <div className="trxHistory-row-mid fund-label-row-header">Amount</div>
              <div className="trxHistory-row-right fund-label-row-header">Status</div>
            </div>
            {this.trxStorage.getTransactions().map((e, i) => (
              <div key={i} className="trxHistory-row">
                <div className="trxHistory-row-left">
                  <a target='_blank' href={linkToEtherScan(e.hash)}>{transformString(e.hash)}</a>
                </div>
                <div className="trxHistory-row-mid fund-label-row">{e.type|| ''}</div>
                <div className="trxHistory-row-mid fund-label-row">{e.amount || ''}</div>
                <div className="trxHistory-row-right fund-label-row" style={{ color: e.status==='PENDING' ? 'red' : 'green' }}>{e.status}</div>
              </div>
            ))}
  
          </div>} */}
        </div>
      )
    }
  }