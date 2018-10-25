import React, { Component } from 'react';
import { withdrawFund } from '@/reducers/invest/action';
import '../ProjectList.scss';
import LoadingGif from '../loading.svg';
const etherScanTxUrl = 'https://rinkeby.etherscan.io/tx';
const linkToEtherScan = (tx) => `${etherScanTxUrl}/${tx}`;
const transformString = str => str.substring(0, 7) + '...'+ str.substring(str.length-5, str.length);
import TransactionStorage from '../../../reducers/invest/transactions';

const ModalBlock = (props) => (
  <div className='project-modal'>
    <div className='project-modal-content'>
      {props.children}
    </div>
  </div>
);

class WithDrawalBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      investAmount: 0,
      isUserConfirmed: false,
      iSubmitted: false,
      estimateGasValue: null,
      txHashs: [],
    }
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
    const txHashs = this.state.txHashs.map(e => e.hash === hash ? ({ hash: e.hash, status: 'Done' }) : e);
    this.setState({ txHashs });
  }

  onSubmitWithDrawal = async () => {
    this.setState({ isSubmitted: true });
    if (!this.props.pid) {
      alert('Project ID doesnt existed');
      return;
    }
    const { run, estimateGas } = await withdrawFund(this.props.pid)() || {};
    // console.log('estimateGas', await estimateGas());
    const estimateGasValue = await estimateGas();
    console.log(estimateGasValue);
    this.setState({ estimateGasValue });
    this.runTrx = run;
  }
  handleConfirmTransaction = () => {
    this.setState({ isUserConfirmed: true });
    this.runTrx().on('transactionHash', (hash) => {
      console.log('txhash', hash);
      this.trxStorage.addTransaction({ hash, status: 'PENDING', type: 'WITHDRAW', amount: this.props.fundAmount });
      this.onFinishedTrx(hash);
    }).on('receipt', (receipt) => {
      this.trxStorage.updateTransaction({ hash: receipt.transactionHash, status: 'DONE' });
      this.onChangeStatusTrx(receipt.transactionHash);
    }).on('error', err => console.log('err', err));
  }
  render() {
    return (
      <div className="invest-button-form-block">
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
      </div>
    )
  }
}

export default WithDrawalBlock;