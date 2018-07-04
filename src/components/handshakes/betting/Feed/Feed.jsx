import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

// services, constants
import { BetHandshakeHandler, SIDE, BETTING_STATUS_LABEL, ROLE, MESSAGE, BET_BLOCKCHAIN_STATUS, BETTING_STATUS } from './BetHandshakeHandler.js';
import momment from 'moment';
import { MasterWallet } from '@/services/Wallets/MasterWallet';

import local from '@/services/localStore';
import { FIREBASE_PATH, HANDSHAKE_ID, API_URL, APP } from '@/constants';
import { uninitItem, collect, refund, collectFree, rollback, uninitItemFree } from '@/reducers/handshake/action';
import { loadMyHandshakeList, updateBettingChange } from '@/reducers/me/action';


// components
import Image from '@/components/core/presentation/Image';
import Button from '@/components/core/controls/Button';
import ModalDialog from '@/components/core/controls/ModalDialog';
import Feed from '@/components/core/presentation/Feed';
import BettingShake from './Shake';
import { showAlert } from '@/reducers/app/action';
import {
  getMessageWithCode, isRightNetwork, getId,
  getShakeOffchain, getBalance, getEstimateGas, isSameAddress, foundShakeList, parseBigNumber,
} from '@/components/handshakes/betting/utils.js';


// css, icons
import './Feed.scss';
import chipIcon from '@/assets/images/icon/betting/chip.svg';
import conferenceCallIcon from '@/assets/images/icon/betting/conference_call.svg';
import ethereumIcon from '@/assets/images/icon/betting/ethereum.svg';
import Shake from '@/components/core/controls/Button';

import GroupBook from './GroupBook';

const betHandshakeHandler = BetHandshakeHandler.getShareManager();
const ROUND = 1000000;
const ROUND_ODD = 10;
const BACKGROUND_COLORS = [
  'linear-gradient(-135deg, #FFA7E7 0%, #EA6362 100%)',
  'linear-gradient(-135deg, #17EAD9 0%, #6078EA 100%)',
  'linear-gradient(-135deg, #23BCBA 0%, #45E994 100%)',
  'linear-gradient(-135deg, #FFDEA7 0%, #EA6362 100%)',
  'linear-gradient(-133deg, #9B3CB7 0%, #FF396F 100%)',
  'linear-gradient(-133deg, #004B91 0%, #78CC37 100%)',
  'linear-gradient(-135deg, #38B8F2 0%, #843CF6 100%)',
  'linear-gradient(-135deg, #E35C67 0%, #381CE2 100%)',
  'linear-gradient(-135deg, #EFBFD5 0%, #9D61FD 100%)',
  'linear-gradient(-135deg, #45E0A7 0%, #D5E969 100%)',
  'linear-gradient(45deg, #FBC79A 0%, #D73E68 100%)',
  'linear-gradient(45deg, #F6AB3E 0%, #8137F7 100%)',
];

class FeedBetting extends React.Component {
  backgroundCss(background) {
    return background || this.BACKGROUND_COLORS[Math.floor(Math.random() * this.BACKGROUND_COLORS.length)];
  }

  static propTypes = {

  }

  static defaultProps = {

  };

  constructor(props) {
    super(props);

    this.state = {
      actionTitle: null,
      statusTitle: null,
      isLoading: false,
      isAction: false,
      role: ROLE.INITER,
      itemInfo: props,
      amountMatch: 0,
      winMatch: 0,
      isUserShake: false,
      shakedItemList: [],
      matchDone: false,
    };
  }

  get isMatch() {
    const { shakeUserIds } = this.props;
    if (shakeUserIds) {
      return shakeUserIds.length > 0;
    }
    return false;
  }

  isShakeUser(shakeIds, userId) {
    // console.log('User Id:', userId);
    // console.log('ShakeIds:', shakeIds);

    if (shakeIds) {
      if (shakeIds.indexOf(userId) > -1) {
        return true;
      }
    }
  }
  isMakerShakerSameUser(userId, initUserId, shakeIds) {
    if (userId == initUserId && this.isShakeUser(shakeIds, userId)) {
      return true;
    }
    return false;
  }

  handleStatus(props) {
    const {
      result, shakeUserIds, id, amount, remainingAmount, odds,
      closingTime, reportTime, disputeTime, initUserId,
    } = props; // new state

    const profile = local.get(APP.AUTH_PROFILE);
    let isUserShake = this.isShakeUser(shakeUserIds, profile.id);
    const isMatch = this.isMatch;
    let amountMatch = 0;
    let winMatch = 0;
    let itemInfo = props;
    let idCryptosign = id;
    if (isMatch) {
      amountMatch = amount - remainingAmount;
      winMatch = amountMatch * odds;
    }
    let shakedItemList = [];
    const isMakerShakerSameUser = this.isMakerShakerSameUser(profile.id, initUserId, shakeUserIds);
    console.log('Amount,RemainingAmount, AmountMatch:', amount, remainingAmount, amountMatch);

    if (isMakerShakerSameUser) {
      // Is Maker win ?
      if ((isMatch && result === BETTING_STATUS.SUPPORT_WIN && side === SIDE.SUPPORT)
          || (isMatch && result === BETTING_STATUS.AGAINST_WIN && side === SIDE.AGAINST)) {
        isUserShake = false;
      }
    }

    if (isUserShake) {
      shakedItemList = foundShakeList(props, id);
      if (shakedItemList.length > 0) {
        itemInfo = shakedItemList[0];
        idCryptosign = getShakeOffchain(itemInfo.id);
        amountMatch = itemInfo.amount;
        winMatch = amountMatch * itemInfo.odds;
      }
    }


    let status = itemInfo.status;
    const side = itemInfo.side;

    const role = isUserShake ? ROLE.SHAKER : ROLE.INITER;
    // const blockchainStatusHardcode = 5;
    // const isMatch = true;
    // const hardCodeResult = 2;

    let isLoading = false;
    const isLoadingObj = betHandshakeHandler?.getLoadingOnChain(idCryptosign);
    console.log('handleStatus idCryptosign:', idCryptosign, ' status = ', status);
    if (isLoadingObj) {
      console.log('handleStatus  isLoadingObj:', isLoadingObj);
      if (status === BET_BLOCKCHAIN_STATUS.STATUS_MAKER_UNINITED || status === BET_BLOCKCHAIN_STATUS.STATUS_DONE) {
        betHandshakeHandler.setItemOnChain(idCryptosign, null);
        isLoading = false;
      } else {
        status = isLoadingObj.status || status;
        isLoading = true;
      }
    }

    const statusResult = BetHandshakeHandler.getStatusLabel(status, result, role, side, isMatch, reportTime, disputeTime);
    const { title, isAction } = statusResult;
    const matchDone = status === BET_BLOCKCHAIN_STATUS.STATUS_DONE;

    this.setState({
      actionTitle: title,
      statusTitle: statusResult.status,
      isAction,
      role,
      itemInfo,
      amountMatch,
      winMatch,
      isUserShake,
      shakedItemList,
      isLoading,
      matchDone,
    });
  }

  randomItemInList(list) {
    return list[Math.floor(Math.random() * list.length)];
  }

  componentDidMount() {
    this.handleStatus(this.props);
  }

  componentWillReceiveProps(nextProps) {
    // console.log('Feeding Next Props:', nextProps);
    if (nextProps && JSON.stringify(nextProps) !== JSON.stringify(this.props)) {
      this.handleStatus(nextProps);
    }
  }

  get extraData() {
    const { extraData } = this.props;
    try {
      return JSON.parse(extraData);
    } catch (e) {
      console.log(e);
      return {};
    }
  }

  getButtonClassName(actionTitle) {
    let buttonClassName = 'cancel';
    switch (actionTitle) {
      case BETTING_STATUS_LABEL.CANCEL:
        break;

      case BETTING_STATUS_LABEL.WITHDRAW:
        buttonClassName = 'withdraw';

        break;
      case BETTING_STATUS_LABEL.REFUND:
        buttonClassName = 'refund';

        break;
      default:
        break;
    }
    return buttonClassName;
  }

  renderStatus = () => {
    const { statusTitle } = this.state;
    return <div className="statusBetting" dangerouslySetInnerHTML={{ __html: statusTitle }} />;
  }

  render() {
    const {
      actionTitle, isAction, itemInfo, role, isLoading,
    } = this.state;

    const { side, odds, status } = itemInfo;
    const { event_name, event_predict } = this.extraData;

    // const styleEventName = {
    //   background: this.randomItemInList(BACKGROUND_COLORS),
    // };
    const colorBySide = side === 1 ? `support` : 'oppose';

    let eventName = event_name || '';
    if (eventName.indexOf('Event') === -1) {
      eventName = `Event: ${eventName}`;
    }
    let predictName = event_predict || '';
    if (predictName.indexOf('Outcome') !== -1) {
      predictName = event_predict.slice(8);
    }
    const buttonClassName = this.getButtonClassName(actionTitle);
    console.log('Sa Role:', role);
    return (
      <div>
        {/* Feed */}
        <Feed
          className="wrapperBettingFeedMe"
          handshakeId={this.props.id}
          onClick={this.props.onFeedClick}
          background="white"
        >
          <div className={`eventTitle event-done-${this.state.matchDone}`}>
            {eventName}
          </div>

          <div className="predictRow">
            <div className="predictName predictTitle">
              <span className={colorBySide}>{side === 1 ? `Support` : 'Oppose'}</span>{predictName}
            </div>
            <div className="predictName"><span className="odds-text-feed">Odds</span> <span className={`odds-value-feed-${colorBySide}`}>{odds}</span></div>
          </div>
          <div className="clearfix">
            <div className="bettingInfo">
              <div className="description">Matched</div>
              <div className="description">You could win</div>
            </div>
            {role == ROLE.INITER ? this.renderMaker() : this.renderShaker()}
          </div>
          <div className="bottomDiv">
            {this.renderStatus()}
            {actionTitle && <Button isLoading={isLoading} block className={buttonClassName} disabled={!isAction} onClick={() => { this.clickActionButton(actionTitle); }}>{actionTitle}</Button>}
          </div>
        </Feed>
      </div>
    );
  }
  renderItem(matchedAmount, amount, colorBySide, odds, winMatch, remaining, winValue) {
    return (
      <div className="bettingInfoValues">
        <div>
          {/* <div className="description">Matched bet (ETH)</div> */}
          {/* <div className="value">{matchedAmount}/{amount}</div> */}
          {/* {<div className="value">{amount} ETH</div>} */}

        </div>
        <div>
          {/* <div className="description">On odds</div> */}
          {/* <div className={`value ${colorBySide}`}> {Math.floor(odds*ROUND_ODD)/ROUND_ODD}</div> */}
          {<div className="value">{matchedAmount}/{amount} ETH</div>}

        </div>
        <div>
          {/* <div className="description">You could win</div> */}
          <div className="value">{winMatch}/{winValue} ETH</div>
          {/* winMatch > 0 && <div className="value">{Math.floor(winMatch * ROUND) / ROUND} ETH matched</div> */}
        </div>
        {/* remaining > 0 && <div className="bettingInfo">
        <div className="value"> Remaining {remaining} ETH</div>
    </div> */}
      </div>
    );
  }
  renderItemShake(shakerList) {
    let displayWinMatch = 0;
    let displayAmount = 0;
    let colorBySide = `support`;
    let displayMatchedAmount = 0;
    let displayRemaining = 0;
    let displayWinValue = 0;
    const oddsItem = 0;
    let remainingValue = 0;
    if (shakerList) {
      shakerList.forEach((item) => {
        const {
          amount = 0, odds = 0, side, remainingAmount,
        } = item;
        remainingValue = remainingAmount || 0;
        colorBySide = side === 1 ? `support` : 'oppose';
        const amountMatch = parseBigNumber(amount);
        const oddsBN = parseBigNumber(odds);
        const winMatch = amountMatch.times(oddsBN).toNumber() || 0;
        const winValue = amountMatch.times(oddsBN).toNumber() || 0;
        displayWinMatch += Math.floor(winMatch * ROUND) / ROUND;
        displayAmount += Math.floor(amount * ROUND) / ROUND;
        displayMatchedAmount = Math.floor(amountMatch * ROUND) / ROUND;
        displayRemaining = Math.floor(remainingValue * ROUND) / ROUND;
        displayWinValue = Math.floor(winValue * ROUND) / ROUND;
      });
    }


    return (this.renderItem(displayMatchedAmount, displayAmount, colorBySide, oddsItem, displayWinMatch, displayRemaining, displayWinValue));
  }
  renderMaker() {
    // console.log('Render Maker');
    const { itemInfo, amountMatch, winMatch } = this.state;

    const {
      amount = 0, odds = 0, side, remainingAmount,
    } = itemInfo;
    const remainingValue = remainingAmount || 0;
    const winValue = parseBigNumber(amount).times(parseBigNumber(odds)).toNumber() || 0;
    const displayAmount = Math.floor(amount * ROUND) / ROUND;
    const displayMatchedAmount = Math.floor(amountMatch * ROUND) / ROUND;
    const displayRemaining = Math.floor(remainingValue * ROUND) / ROUND;
    const displayWinMatch = Math.floor(winMatch * ROUND) / ROUND;
    const displayWinValue = Math.floor(winValue * ROUND) / ROUND;
    const colorBySide = side === 1 ? `support` : 'oppose';

    return (
      this.renderItem(displayMatchedAmount, displayAmount, colorBySide, odds, displayWinMatch, displayRemaining, displayWinValue)
    );
  }
  renderShaker() {
    // console.log('Render Maker');

    const { shakedItemList } = this.state;

    return (
      <div>
        {this.renderItemShake(shakedItemList)}
      </div>
    );
  }
  changeOption(value) {
    // console.log('Choose option:', value)
    // TO DO: Choose an option
  }
  handleActionFree(title, offchain) {
    const realId = getId(offchain);

    switch (title) {
      case BETTING_STATUS_LABEL.CANCEL:
        // TO DO: CLOSE BET
        // this.uninitItem(realId);
        this.uninitItemFree(realId);
        break;
      case BETTING_STATUS_LABEL.WITHDRAW:
        this.collectFree(offchain);
        break;
    }
  }
  async handleActionReal(title, offchain, hid) {
    const realId = getId(offchain);
    const { itemInfo } = this.state;

    switch (title) {
      case BETTING_STATUS_LABEL.CANCEL:
        // TO DO: CLOSE BET
        this.cancelOnChain(offchain, hid);

        break;

      case BETTING_STATUS_LABEL.WITHDRAW:

        this.withdrawOnChain(offchain, hid);
        break;
      case BETTING_STATUS_LABEL.REFUND:
        this.refundOnChain(offchain, hid);
        break;
    }
  }
  async cancelOnChain(offchain, hid) {
    const { itemInfo } = this.state;
    const { side, amount, odds } = itemInfo;
    this.setState({
      isLoading: true,
    });
    betHandshakeHandler.setItemOnChain(offchain, itemInfo);
    const result = await betHandshakeHandler.cancelBet(hid, side, amount, odds, offchain);
    const { hash } = result;
    if (hash) {
      // betHandshakeHandler.setItemOnChain(offchain, false);
      const updateInfo = Object.assign({}, itemInfo);
      updateInfo.status = BET_BLOCKCHAIN_STATUS.STATUS_MAKER_UNINIT_PENDING;
      betHandshakeHandler.setItemOnChain(offchain, updateInfo);
      this.props.updateBettingChange(updateInfo);
    }
  }
  async withdrawOnChain(offchain, hid) {
    const { itemInfo } = this.state;
    this.setState({
      isLoading: true,
    });
    betHandshakeHandler.setItemOnChain(offchain, true);
    const result = await betHandshakeHandler.withdraw(hid, offchain);
    const { hash } = result;
    console.log('Sa test:', result);
    if (hash) {
      console.log('Sa test Update Withdraw UI');
      betHandshakeHandler.setItemOnChain(offchain, false);
      const updateInfo = Object.assign({}, itemInfo);
      updateInfo.status = BET_BLOCKCHAIN_STATUS.STATUS_COLLECT_PENDING;
      this.props.updateBettingChange(updateInfo);
    }
  }
  async refundOnChain(offchain, hid) {
    const { itemInfo } = this.state;
    const { side, amount, odds } = itemInfo;
    this.setState({
      isLoading: true,
    });
    betHandshakeHandler.setItemOnChain(offchain, true);
    const result = await betHandshakeHandler.refund(hid, side, amount, odds, offchain);
    const { hash } = result;
    if (hash) {
      betHandshakeHandler.setItemOnChain(offchain, false);
      const updateInfo = Object.assign({}, itemInfo);
      updateInfo.status = BET_BLOCKCHAIN_STATUS.STATUS_MAKER_UNINIT_PENDING;
      this.props.updateBettingChange(updateInfo);
    }
  }
  async clickActionButton(title) {
    const balance = await getBalance();
    const estimatedGas = await getEstimateGas();
    let message = null;
    const {
      id, shakeUserIds, freeBet, fromAddress, hid,
    } = this.props; // new state
    let idCryptosign = id;
    let isFreeBet = freeBet;
    let userFromAddress = fromAddress;
    const profile = local.get(APP.AUTH_PROFILE);
    const isUserShake = this.isShakeUser(shakeUserIds, profile.id);
    if (isUserShake) {
      const shakedItemList = foundShakeList(this.props, id);
      if (shakedItemList.length > 0) {
        const shakeItem = shakedItemList[0];
        idCryptosign = getShakeOffchain(shakeItem.id);
        isFreeBet = shakeItem.free_bet;
        userFromAddress = shakeItem.from_address;
      }
    }
    console.log(
      'idCryptosign, isFreeBet, isUserShaker, fromAddress: ', idCryptosign,
      isFreeBet, isUserShake, userFromAddress,
    );
    // userFromAddress = "abc";
    if (!isRightNetwork()) {
      message = MESSAGE.RIGHT_NETWORK;
    } else if (!isSameAddress(userFromAddress)) {
      message = MESSAGE.DIFFERENCE_ADDRESS;
    } else if (isFreeBet) {
      this.handleActionFree(title, idCryptosign);
    } else if (estimatedGas > balance) {
      message = MESSAGE.NOT_ENOUGH_GAS;
    } else {
      this.handleActionReal(title, idCryptosign, hid);
    }
    if (message) {
      this.props.showAlert({
        message: <div className="text-center">{message}</div>,
        timeOut: 3000,
        type: 'danger',
        callBack: () => {
        },
      });
    }
  }
  loadMyHandshakeList = () => {
    this.props.loadMyHandshakeList({ PATH_URL: API_URL.ME.BASE });
  }

  async uninitItemFree(id) {
    const balance = await getBalance();
    console.log('Balance:', balance);
    const url = API_URL.CRYPTOSIGN.UNINIT_HANDSHAKE_FREE.concat(`/${id}`);
    this.props.uninitItemFree({
      PATH_URL: url,
      METHOD: 'POST',
      successFn: this.uninitHandshakeFreeSuccess,
      errorFn: this.uninitHandshakeFreeFailed,
    });
  }
  uninitHandshakeFreeSuccess= async (successData) => {
    console.log('uninitHandshakeFreeSuccess', successData);
    const { status } = successData;
    if (status) {
      const { itemInfo } = this.state;

      const updateInfo = Object.assign({}, itemInfo);
      updateInfo.status = BET_BLOCKCHAIN_STATUS.STATUS_MAKER_UNINIT_PENDING;
      this.props.updateBettingChange(updateInfo);
    }
  }
  uninitHandshakeFreeFailed = (error) => {
    console.log('uninitHandshakeFreeFailed', error);
    const { status, code } = error;
    if (status == 0) {
      const message = getMessageWithCode(code);
      this.props.showAlert({
        message: <div className="text-center">{message}</div>,
        timeOut: 3000,
        type: 'danger',
        callBack: () => {
        },
      });
    }
  }
  collectFree(id) {
    console.log('Call Collect Free');
    const params = {
      offchain: id,
    };
    this.props.collectFree({
      PATH_URL: API_URL.CRYPTOSIGN.COLLECT_FREE,
      METHOD: 'POST',
      data: params,
      successFn: this.collectFreeSuccess,
      errorFn: this.collectFreeFailed,
    });
  }

  collectFreeSuccess = async (successData) => {
    console.log('collectFreeSuccess', successData);
    const { status } = successData;
    if (status) {
      this.props.showAlert({
        message: <div className="text-center">{MESSAGE.WITHDRAW_SUCCESS}</div>,
        timeOut: 3000,
        type: 'success',
        callBack: () => {
        },
      });
      const { itemInfo } = this.state;

      const updateInfo = Object.assign({}, itemInfo);
      updateInfo.status = BET_BLOCKCHAIN_STATUS.STATUS_COLLECT_PENDING;
      this.props.updateBettingChange(updateInfo);
    }
  }
  collectFreeFailed = (error) => {
    console.log('collectFreeFailed', error);
    const { status, code } = error;
    if (status == 0) {
      const message = getMessageWithCode(code);
      this.props.showAlert({
        message: <div className="text-center">{message}</div>,
        timeOut: 3000,
        type: 'danger',
        callBack: () => {
        },
      });
    }
  }

  refund(id) {
    const url = API_URL.CRYPTOSIGN.REFUND.concat(`/${id}`);
    this.props.refund({
      PATH_URL: API_URL.CRYPTOSIGN.REFUND,
      METHOD: 'POST',
      successFn: this.refundSuccess,
      errorFn: this.refundFailed,
    });
  }

  refundSuccess = async (successData) => {
    console.log('refundSuccess', successData);
    const { status } = successData;
    if (status) {
      const { hid, id, status } = this.props;
      const { itemInfo } = this.state;
      const updateInfo = Object.assign({}, itemInfo);
      updateInfo.bkStatus = itemInfo.status;
      updateInfo.status = status;

      this.props.updateBettingChange(updateInfo);


      const offchain = id;
      const result = await betHandshakeHandler.refund(hid, offchain);
    }
  }
  refundFailed = (error) => {
    console.log('refundFailed', error);
    const { status, code } = error;
    if (status == 0) {
      const message = getMessageWithCode(code);
      this.props.showAlert({
        message: <div className="text-center">{message}</div>,
        timeOut: 3000,
        type: 'danger',
        callBack: () => {
        },
      });
    }
  }


  rollback(offchain) {
    const params = {
      offchain,
    };
    this.props.rollback({
      PATH_URL: API_URL.CRYPTOSIGN.ROLLBACK,
      METHOD: 'POST',
      data: params,
      successFn: this.rollbackSuccess,
      errorFn: this.rollbackFailed,
    });
  }
  rollbackSuccess = async (successData) => {
    console.log('rollbackSuccess', successData);
  }
  rollbackFailed = (error) => {
    console.log('rollbackFailed', error);
    const { status, code } = error;

    if (status == 0) {
      const message = getMessageWithCode(code);
      this.props.showAlert({
        message: <div className="text-center">{message}</div>,
        timeOut: 3000,
        type: 'danger',
        callBack: () => {
        },
      });
    }
  }
}

const mapState = state => ({
  // firebaseUser: state.firebase.data,
});
const mapDispatch = ({
  loadMyHandshakeList,
  updateBettingChange,
  uninitItem,
  collect,
  collectFree,
  refund,
  rollback,
  showAlert,
  uninitItemFree,
});
export default connect(mapState, mapDispatch)(FeedBetting);
