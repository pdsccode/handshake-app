import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// services, constants
import  { BetHandshakeHandler, SIDE, BETTING_STATUS_LABEL} from './BetHandshakeHandler.js';
import momment from 'moment';
import {MasterWallet} from '@/models/MasterWallet';

import local from '@/services/localStore';
import {FIREBASE_PATH, HANDSHAKE_ID, API_URL, APP} from '@/constants';
import { BettingHandshake } from '@/services/neuron';
import { uninitItem, collect, refund, rollback } from '@/reducers/handshake/action';


// components
import Image from '@/components/core/presentation/Image';
import Button from '@/components/core/controls/Button';
import ModalDialog from '@/components/core/controls/ModalDialog';
import Feed from '@/components/core/presentation/Feed';
import BettingShake from './Shake';

// css, icons
import './Feed.scss';
import chipIcon from '@/assets/images/icon/betting/chip.svg';
import conferenceCallIcon from '@/assets/images/icon/betting/conference_call.svg';
import ethereumIcon from '@/assets/images/icon/betting/ethereum.svg';
import Shake from '@/components/core/controls/Button';

import GroupBook from './GroupBook';

const wallet = MasterWallet.getWalletDefault('ETH');
const chainId = wallet.chainId;
const bettinghandshake = new BettingHandshake(chainId);
class FeedBetting extends React.Component {
  static propTypes = {

  }

  static defaultProps = {

  };

  constructor(props) {
      super(props);

      this.state = {
        actionTitle: null,
        statusTitle: null,
        isAction: false,
        role: null,
        isMatch: false,
      };


  }

  get isMatch(){
    const {shakeCount} = this.props;
    if(shakeCount){
      return shakeCount > 0 ? true : false;

    }
    return false;
  }

  componentDidMount() {
    const {status, side, result} = this.props;

    console.log('Props:', this.props);
    console.log('Status:', status);
    //const hardCodeStatus = 2;
    const role = side;
    //const blockchainStatusHardcode = 0;
    const isMatch = this.isMatch;
    //const isMatch = true;
    console.log('Is Match:', isMatch);

    const statusResult = BetHandshakeHandler.getStatusLabel(status, result, role, isMatch);
    const {title, isAction} = statusResult;
    this.setState({
      actionTitle: title,
      statusTitle: statusResult.status,
      isAction,
      role,
      isMatch,
    })

  }

  componentWillReceiveProps(nextProps) {

  }

  get extraData(){
    const {extraData} = this.props
    try {
      return JSON.parse(extraData);
    }catch(e){
      console.log(e);
      return {}
    }
  }

  renderStatus = () => {
    const {statusTitle} = this.state;
    const text = "Match is ongoing...";
    //const textColor = status == 2?'white':'#35B371';
    const textColor = 'white';
    //const backgroundColorWithStatus = status == 2? 'ffffff25' :'#00000030';
    const backgroundColorWithStatus = '#ffffff25';
    return <Button style={{backgroundColor:backgroundColorWithStatus , borderColor:'transparent',color:textColor}}  block disabled >{statusTitle}</Button>;
  }

  render() {
    const {actionTitle , isAction,side } = this.state;
    const backgroundColor = side === SIDE.SUPPORT ? "#85D477":'#FB7753';
    // const {actionTitle = "Match is ongoing...", isAction =true} = this.state;
     /***
     * side = SIDE.SUPPORT // SIDE.AGAINST ;ORGRANCE
     *
     */
    const {event_name, event_predict, event_odds, event_bet,event_date, balance} = this.extraData;

    return (
      <div>
        {/* Feed */}
        <Feed
          className="wrapperBettingFeed"
          handshakeId={this.props.id}
          onClick={this.props.onFeedClick}
        >
            <div className="description">
              <p>{event_name}</p>
              <p className="eventInfo">{event_predict}</p>
            </div>
            <div className="bottomWrapper">
              <span className="odds" >1:{event_odds}</span>
              <span className="content"  >{event_bet} ETH</span>
            </div>
            {this.renderStatus()}
        </Feed>
        {/* Shake */}
        {actionTitle && <Button block disabled={!isAction} onClick={() => { this.clickActionButton(actionTitle); }}>{actionTitle}</Button>}
        {/* Modal */}
        {/*<ModalDialog title="Make a bet" onRef={modal => this.modalBetRef = modal}>
          <BettingShake
            remaining={remaining}
            odd={0.1}
            onCancelClick={() => this.modalBetRef.close()}
            onSubmitClick={(amount) => this.submitShake(amount)}
          />
    </ModalDialog>*/}
      </div>
    );

  }
  changeOption(value){
    console.log('Choose option:', value)
    //TO DO: Choose an option
  }

  clickActionButton(title){
    const {id} = this.props;

    switch(title){

      case BETTING_STATUS_LABEL.CANCEL:
        // TO DO: CLOSE BET
        this.uninitItem(id);
        break;

      case BETTING_STATUS_LABEL.WITHDRAW:
        // TO DO: WITHDRAW
        this.collect(id);
        break;
      case BETTING_STATUS_LABEL.REFUND:
      this.refund(id);
      break;

    }


  }
  uninitItem(id){
    const url = API_URL.CRYPTOSIGN.UNINIT_HANDSHAKE.concat(`/${id}`);
    this.props.uninitItem({PATH_URL: url, METHOD:'POST',
    successFn: this.uninitHandshakeSuccess,
    errorFn: this.uninitHandshakeFailed
  });
  }
  uninitHandshakeSuccess= async (successData)=>{
    console.log("uninitHandshakeSuccess", successData);
    const {status, data} = successData
    if(status && data){
      const {hid, side, amount, odds, offchain} = data;
      const stake = amount;
      const payout = stake * odds;
      bettinghandshake.cancelBet(hid, side, stake, payout, offchain);

    }
  }
  uninitHandshakeFailed = (error) => {
    console.log('uninitHandshakeFailed', error);
  }

  collect(id){
    const url = API_URL.CRYPTOSIGN.COLLECT.concat(`/${id}`);
    this.props.collect({PATH_URL: url, METHOD:'POST',
    successFn: this.collectSuccess,
    errorFn: this.collectFailed
  });
  }

  collectSuccess = async (successData)=>{
    console.log('collectSuccess', successData);
    const {status, data} = successData
    if(status && data){
      const {hid, offchain} = data;

      bettinghandshake.withdraw(hid, offchain);

    }
  }
  collectFailed = (error) => {
    console.log('collectFailed', error);

  }

  refund(id){
    const url = API_URL.CRYPTOSIGN.REFUND.concat(`/${id}`);
    this.props.refund({PATH_URL: API_URL.CRYPTOSIGN.REFUND, METHOD:'POST',
    successFn: this.refundSuccess,
    errorFn: this.refundFailed
  });
  }

  refundSuccess = async (successData)=>{
    console.log('refundSuccess', successData);
    const {status, data} = successData
    if(status && data){
    }
  }
  refundFailed = (error) => {
    console.log('refundFailed', error);
  }

  rollback(id, offchain){
    const params = {
      offchain
    }
    const url = API_URL.CRYPTOSIGN.ROLLBACK.concat(id);
    this.props.rollback({PATH_URL: url, METHOD:'POST', data: params,
    successFn: this.rollbackSuccess,
    errorFn: this.rollbackFailed
  });
  }
  rollbackSuccess = async (successData)=>{
    console.log('rollbackSuccess', successData);
  }
  rollbackFailed = (error) => {
    console.log('rollbackFailed', error);
  }
}

const mapState = state => ({
  firebaseUser: state.firebase.data,
});
const mapDispatch = ({
  uninitItem,
  collect,
  refund,
  rollback
});
export default connect(mapState, mapDispatch)(FeedBetting);

