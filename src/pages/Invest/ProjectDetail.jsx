import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fetch_project_detail, getNumberOfFund, getSMProjectInfo, getFundAmount, getImageUrl, toHexColor } from '@/reducers/invest/action';
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
import { wrapBoundary } from '../../components/ErrorBoundary';
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
    this.hedgeFundApi = new  HedgeFundAPI('latest', false);
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
    const wallets = MasterWallet.getWalletDefault();
    console.log('wallet default ', wallets);
    // const { balance, privateKey } = wallets.find(({ name, network}) => name === 'ETH' && network === 'https://rinkeby.infura.io/') || {};
    const { balance, privateKey } = wallets.ETH || {};
    const investAmount = Number(this.state.investAmount);
    const totalBalance = Number(balance);
    if (totalBalance <= investAmount) {
      alert(`You dont have enough eth. Please invest amount less than ${balance}`);
      return;
    }
    // const { run, estimateGas } = await this.hedgeFundApi.fundProject(privateKey, '' + investAmount, '0x' + this.props.pid) || {};
    console.log(investAmount)
    const { run, estimateGas } = await this.hedgeFundApi.fundProject(privateKey, '' + investAmount, '0x' + this.props.pid) || {};
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

class NumberInvestorComp extends React.Component {
  state = {
    loading: true,
    data: null
  }
  componentDidMount() {
    getNumberOfFund(this.props.pid).then(data => this.setState({ loading: false, data }));
  }
  render() {
    if (this.state.loading) return <div><img src={LoadingGif} style={{ width: '50px', height: '50px' }} /></div>
    return <div>{this.state.data}</div>
  }
}
const NumberInvestor = wrapBoundary(NumberInvestorComp);

class ProjectInfoComp extends React.Component {
  constructor(props) {
    super(props);
    this.props.getSMProjectInfo(props.project.id).then(r=> {
      this.props.getFundAmount(props.project.id).catch(err => console.log('err', err));
    }).catch(err => console.log('err', err));
  }
  render() {
    const { project, smProject } = this.props;
    const progressPrev = (Number(project.fundingAmount || 0)/Number(project.target|| 1) * 100).toFixed(2);
    const progress = smProject ? (Number(smProject.fundingAmount || 0)/Number(smProject.target|| 1) * 100).toFixed(2) : progressPrev;
    const numFunder = smProject ? smProject.numFunder : (project.numberOfFunder || (<img src={LoadingGif} style={{ width: '50px', height: '50px' }} />));
    const fundAmount = smProject ? smProject.fundAmount : '';
    return (
      <div className="fund-item float-right" style={{ marginTop: '-10px' }}>
        <label htmlFor="" className="fund-item-value">{project.displayLifeTime}</label>
        <label htmlFor="" className="fund-item-value">
          {project.target} {project.currency}
        </label>
        <label htmlFor="" className="fund-item-value">
          {project.lifeTime} {'days'}
        </label>
        <label htmlFor="" className="fund-item-value">
          {progress} % 
        </label>
        <label htmlFor="" className="fund-item-value">
          {new Date(project.deadline).toDateString()}
        </label>
        <label htmlFor="" className="fund-item-value">
          {numFunder}
        </label>
        <label htmlFor="" className="fund-item-value">
          {fundAmount} ETH
        </label>
      </div>
    )
  }
}
const projectMapState = (state) => ({
  smProject: state.invest && state.invest.smProject ? state.invest.smProject : null
})
const ProjectInfo = connect(projectMapState, { getSMProjectInfo, getFundAmount })(ProjectInfoComp)

class ProjectDetail extends Component {
  constructor(props) {
    super(props);
    console.log('projectDetail', this.props);
    console.log('match', this.props.match.params.projectID)
    this.state = {
      loading: true,
    }
    // this.getProjectDetail();
  }
  getProjectDetail = () => {
    this.props.fetch_project_detail(this.props.match.params.projectID).then(r => this.setState({ loading: false })).catch(err => console.log(err));
  }
  componentDidMount = () => {
    this.getProjectDetail();
  }
  renderProjects() {
    const { project } = this.props;
    const progressPercentage = (Number(project.fundingAmount || 0)/Number(project.target|| 1) * 100).toFixed(2);
    console.log(project);
      return (
        <div key={project.id} style={{ marginTop: '1em' }} >
          <div className="projectItem">
            <h5>
              {project.name}
            </h5>
            <div className="progressBlock">
              <span className="progressCount">{progressPercentage}%</span>
              <ProgressBar now={Number(progressPercentage)} className="progressbar" />

              <div className="userInfoBlock clearfix userInfoBlockProjectDetails">
                <div className="userItem">
                {project.User.avatar && <img
                  src={getImageUrl(project.User.avatar)}
                  alt=""
                  className="userImage"
                />}
                {!project.User.avatar && <div className="avatar_non" style={{ backgroundColor: toHexColor(project.User.firstName)}}>
                    {`${project.User.firstName[0].toUpperCase() + project.User.lastName[0].toUpperCase()}`}
                </div>}
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
                {/* <label htmlFor="" className="fund-label">Target Earning</label> */}
                <label htmlFor="" className="fund-label">Number of investor</label>
                <label htmlFor="" className="fund-label">Your fund</label>
              </div>
              <ProjectInfo project={project} />
              </div>
            </div>
          </div>
          <FormInvestBlock pid={project.id} />
        </div>
    );
  }

  render() {
    if (this.state.loading) return <div>loading...</div>
    return (
      <div style={{ backgroundColor: '#fafbff', minHeight: '100vh' }}>
        <InvestNavigation header="Project" history={this.props.history} />
        {this.renderProjects()}
      </div>
    );
  }
}

const mapState = (state, ownProps) => ({
  project: state.invest && state.invest.project ? state.invest.project : {},
  ...ownProps
})

export default connect(mapState, { fetch_project_detail })(ProjectDetail);
