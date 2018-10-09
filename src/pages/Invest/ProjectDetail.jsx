import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetch_projects } from '@/reducers/invest/action';
import { Grid, Row, Col, ProgressBar ,Button } from 'react-bootstrap';
import _ from 'lodash';
import Utils from './Utils';
import StarRatings from 'react-star-ratings';
import './ProjectList.scss';
import iconBitcoin from '@/assets/images/icon/coin/btc.svg';
import iconEthereum from '@/assets/images/icon/coin/eth.svg';
import iconUsd from '@/assets/images/icon/coin/icons8-us_dollar.svg';
import createForm from '@/components/core/form/createForm';
import { InputGroup, InputGroupAddon, InputGroupText, Input } from 'reactstrap';
import InvestNavigation from './InvestNavigation';
import HedgeFundAPI from './contracts/HedgeFundAPI';
import { MasterWallet } from '../../services/Wallets/MasterWallet';
import LoadingGif from './loading.svg';
// Refer to FeedCreditCard.jsx
const etherScanTxUrl = 'https://rinkeby.etherscan.io/tx';
const linkToEtherScan = (tx) => `${etherScanTxUrl}/${tx}`;
const transformString = str => str.substring(0, 7) + '...'+ str.substring(str.length-5, str.length);
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

class FormInvestBlock extends Component {
  constructor(props) {
    super(props);
    this.state = {
      investAmount: 0,
      isUserConfirmed: false,
      iSubmitted: false,
      estimateGasValue: null,
      txHashs: [],
    }
    this.hedgeFundApi = new  HedgeFundAPI('v1', false);
    this.runTrx = null;
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

  onChangeAmount = (e) => this.setState({ investAmount: e.target.value })

  onSubmitInvest = async () => {
    this.setState({ isSubmitted: true });
    if (!this.props.pid) {
      alert('Project ID doesnt existed');
      return;
    }
    console.log('project id is', this.props.pid);
    const wallets = MasterWallet.getWalletDataLocalString();
    console.log(wallets);
    const { balance, privateKey } = wallets.find(({ name, network}) => name === 'ETH' && network === 'https://rinkeby.infura.io/') || {};
    const investAmount = Number(this.state.investAmount);
    const totalBalance = Number(balance);
    if (totalBalance <= investAmount) {
      alert(`You dont have enough eth. Please invest amount less than ${balance}`);
      return;
    }
    // const { run, estimateGas } = await this.hedgeFundApi.fundProject(privateKey, '' + investAmount, '0x' + this.props.pid) || {};
    console.log(investAmount)
    const { run, estimateGas } = await this.hedgeFundApi.fundProject(privateKey, '' + investAmount, '0x1001') || {};
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
      this.onFinishedTrx(hash);
    }).on('receipt', (receipt) => {
      console.log('receipt', receipt);
      this.onChangeStatusTrx(receipt.transactionHash);
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
        {this.state.txHashs.length > 0 && <div className="trxHistory">
          <div className="trxHistory-row">
            <div className="trxHistory-row-left fund-label">Trx</div>
            <div className="trxHistory-row-right fund-label">Status</div>
          </div>
          {this.state.txHashs.map((e, i) => (
            <div key={i} className="trxHistory-row">
              <div className="trxHistory-row-left">
                <a target='_blank' href={linkToEtherScan(e.hash)}>{transformString(e.hash)}</a>
              </div>
              <div className="trxHistory-row-right fund-label" style={{ color: e.status==='Pending' ? 'red' : 'green' }}>{e.status}</div>
            </div>
          ))}

        </div>}
      </div>
    )
  }
}


class ProjectDetail extends Component {
  componentDidMount() {
    this.props.fetch_projects();
  }
  renderProjects() {
    const project= this.props.projects[0];
      return (
        <div key={project.id} style={{ marginTop: '1em' }} >
          <div className="projectItem">
            <h5>
              {project.name}
            </h5>
            <div className="progressBlock">
              <span className="progressCount">{project.progressPercentage}%</span>
              <ProgressBar now={project.progressPercentage} className="progressbar" />

              <div className="userInfoBlock clearfix userInfoBlockProjectDetails">
                <div className="userItem">
                <img
                  src="https://randomuser.me/api/portraits/men/9.jpg"
                  alt=""
                  className="userImage"
                />
                <span className="userName">{project.displayName}</span>
                <div className="star-ratings">
                  <StarRatings
                    className="stars"
                    rating={3}
                    isSelectable={false}
                    starDimension="12px"
                    starRatedColor="#546FF7"
                    starSpacing="3px"
                    numberOfStars={5}
                    name="rating"
                  />
                  <span className="rating-count">(26)</span>
                </div>
              </div>
              </div>
              <div className="fundBlock clearfix">
                <div className="fund-item float-left">
                <label htmlFor="" className="fund-label">Req. Fund</label>
                <label htmlFor="" className="fund-label">Inv. Period</label>
                <label htmlFor="" className="fund-label">Progress</label>
                <label htmlFor="" className="fund-label">Deadline</label>
                <label htmlFor="" className="fund-label">Target Earning</label>
                <label htmlFor="" className="fund-label">Number of investor</label>
              </div>


                <div className="fund-item float-right">
                <label htmlFor="" className="fund-item-value">{project.displayLifeTime}</label>
                <label htmlFor="" className="fund-item-value">
                  {project.target} {project.currency}
                </label>
                <label htmlFor="" className="fund-item-value">
                  {project.target} {project.currency}
                </label>
                <label htmlFor="" className="fund-item-value">
                  {project.target} {project.currency}
                </label>
                <label htmlFor="" className="fund-item-value">
                  {project.target} {project.currency}
                </label>
                <label htmlFor="" className="fund-item-value">
                  {project.target} {project.currency}
                </label>
              </div>
              </div>
            </div>
          </div>
          <FormInvestBlock pid={project.id} />
        </div>
    );
  }

  render() {
    return (
      <div style={{ backgroundColor: '#fafbff', minHeight: '100vh' }}>
        <InvestNavigation header="Project" history={this.props.history} />
        {this.props.projects && this.props.projects.length > 0 && this.renderProjects()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  if (!state.invest) {
    return { projects: [] };
  }
  return { projects: state.invest.projects };
}

export default connect(mapStateToProps, { fetch_projects })(ProjectDetail);
