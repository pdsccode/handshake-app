import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// services, constants
import  { BetHandshakeHandler, SIDE, BETTING_STATUS_LABEL} from './BetHandshakeHandler.js';
import momment from 'moment';
import {MasterWallet} from '@/models/MasterWallet';

import { APP } from '@/constants';
import local from '@/services/localStore';
import {FIREBASE_PATH} from '@/constants';
import { BettingHandshake } from '@/services/neuron';


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
    const hardCodeStatus = 2;
    const role = side;
    const isMatch = this.isMatch;
    const statusResult = BetHandshakeHandler.getStatusLabel(this.props.result, role, isMatch);
    const {title, isAction} = result;
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
    console.log(extraData);
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
        <Feed className="feed" handshakeId={this.props.id} onClick={this.props.onFeedClick} background="white">
          <div className="wrapperBettingFeed" style={{backgroundColor:backgroundColor}}>
            <div className="description">
              <p>{event_name}</p>
              <p className="eventInfo">{event_predict}</p>
            </div>
            <div className="bottomWrapper">
              <span className="odds" >1:{event_odds}</span>
              <span className="content"  >{event_bet} ETH</span>
            </div>
            {this.renderStatus()}
          </div>

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
    const {id, outcome_id, side, extraData, hid, odds} = this.props;
    const {event_bet, event_odds} = JSON.parse(extraData);
    //const hid = outcome_id;
    const stake = event_bet;
    const payout = stake * odds;
    const offchain = id;
    switch(title){

      case BETTING_STATUS_LABEL.CANCEL:
        // TO DO: CLOSE BET
        bettinghandshake.cancelBet(hid, side,stake,payout,offchain);
        break;

      case BETTING_STATUS_LABEL.WITHDRAW:
        // TO DO: WITHDRAW
        bettinghandshake.withdraw(hid, offchain);
        break;

    }


  }
}

const mapState = state => ({
  firebaseUser: state.firebase.data,
});
const mapDispatch = ({
});
export default connect(mapState, mapDispatch)(FeedBetting);

