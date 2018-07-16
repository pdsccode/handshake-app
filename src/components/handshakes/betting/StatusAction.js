import { BET_BLOCKCHAIN_STATUS, ROLE, SIDE, BETTING_RESULT } from '@/components/handshakes/betting/constants.js';
import { isExpiredDate } from '@/components/handshakes/betting/validation.js';
import { BETTING_STATUS_LABEL } from '@/components/handshakes/betting/message.js';

const TAG = 'STATUSACTION';

export const getStatusLabel = (blockchainStatus, resultStatus, role, side, isMatch, reportTime, disputeTime) => {
  let label = null;
  let strStatus = null;
  let isAction = false;
  console.log(TAG,'getStatusLabel', ' blockchainStatus:', blockchainStatus,
                  ' resultStatus:', resultStatus,
                  ' role:', role,
                  ' side:', side,
                  ' isMatch:', isMatch,
                  ' reportTime:', reportTime,
                  ' disputeTime:', disputeTime);

  if(blockchainStatus === BET_BLOCKCHAIN_STATUS.STATUS_INIT_FAILED
    || blockchainStatus === BET_BLOCKCHAIN_STATUS.STATUS_COLLECT_FAILED
    || blockchainStatus === BET_BLOCKCHAIN_STATUS.STATUS_MAKER_UNINIT_FAILED
    || blockchainStatus === BET_BLOCKCHAIN_STATUS.STATUS_REFUND_FAILED
    || blockchainStatus === BET_BLOCKCHAIN_STATUS.STATUS_DISPUTE_FAILED){
      //FAILED ACTION
      return failedAction(blockchainStatus);

  }

  if (blockchainStatus === BET_BLOCKCHAIN_STATUS.STATUS_INIT_PENDING
    || blockchainStatus === BET_BLOCKCHAIN_STATUS.STATUS_MAKER_UNINIT_PENDING
    || blockchainStatus === BET_BLOCKCHAIN_STATUS.STATUS_COLLECT_PENDING){
      //PENDING ACTION
      return pendingAction(blockchainStatus);

  }

  if (blockchainStatus === BET_BLOCKCHAIN_STATUS.STATUS_MAKER_SHOULD_UNINIT
    || blockchainStatus === BET_BLOCKCHAIN_STATUS.STATUS_MAKER_UNINITED
    || (!isMatch && role === ROLE.INITER && blockchainStatus === BET_BLOCKCHAIN_STATUS.STATUS_INITED)){
      //CANCEL ACTION
      return cancelAction(blockchainStatus);
  }

  if ((isMatch && resultStatus === BETTING_RESULT.DRAW)
      || (isMatch && resultStatus === BETTING_RESULT.INITED && isExpiredDate(reportTime))
      || blockchainStatus === BET_BLOCKCHAIN_STATUS.STATUS_REFUND) {
        //REFUND ACTION
      return refundAction(blockchainStatus);
  }

  if (resultStatus === BETTING_RESULT.INITED && // hasn't has result
      ((isMatch && blockchainStatus === BET_BLOCKCHAIN_STATUS.STATUS_INITED) //marker
     || (blockchainStatus === BET_BLOCKCHAIN_STATUS.STATUS_SHAKER_SHAKED))) { //shaker

      //MATCHED WAITING RESULT
      return matchAction();
  }

  if (isMatch && resultStatus > BETTING_RESULT.INITED && resultStatus < BETTING_RESULT.DRAW
    && blockchainStatus !== BET_BLOCKCHAIN_STATUS.STATUS_DONE) { //Has result and matched
      return winOrLose(resultStatus, side, disputeTime);
  }

  if (blockchainStatus === BET_BLOCKCHAIN_STATUS.STATUS_DONE) {
      return doneAction();
  }

  if (blockchainStatus === BET_BLOCKCHAIN_STATUS.STATUS_MAKER_INIT_ROLLBACK
    || blockchainStatus === BET_BLOCKCHAIN_STATUS.STATUS_SHAKER_ROLLBACK) {
      return rollbackAction();
    }

  return { title: label, isAction, status: strStatus };
}

const failedAction = (blockchainStatus) => {
  let label = null;
  let strStatus = null;
  let isAction = false;

  switch (blockchainStatus) {
    case BET_BLOCKCHAIN_STATUS.STATUS_INIT_FAILED :
      strStatus = BETTING_STATUS_LABEL.INIT_FAILED ;
      break;
    case BET_BLOCKCHAIN_STATUS.STATUS_COLLECT_FAILED :
      label = BETTING_STATUS_LABEL.CANCEL;
      strStatus = BETTING_STATUS_LABEL.COLLECT_FAILED;
      isAction = true;
      break;
    default:
      strStatus = BETTING_STATUS_LABEL.ACTION_FAILED;
      isAction = false;
      break;
  }
  return { title: label, isAction, status: strStatus };
}

const pendingAction = (blockchainStatus) => {
  let label = null;
  let strStatus = null;
  let isAction = false;

  switch (blockchainStatus) {
    case BET_BLOCKCHAIN_STATUS.STATUS_INIT_PENDING :
      strStatus = BETTING_STATUS_LABEL.INITING;
      break;
    case BET_BLOCKCHAIN_STATUS.STATUS_MAKER_UNINIT_PENDING :
      strStatus = BETTING_STATUS_LABEL.PROGRESSING;
      break;
    case BET_BLOCKCHAIN_STATUS.STATUS_COLLECT_PENDING :
      strStatus = BETTING_STATUS_LABEL.COLLECT_PENDING;
      break;
    default:
      break;
  }

  return { title: label, isAction, status: strStatus };
}

const cancelAction = (blockchainStatus) => {
  let label = null;
  let strStatus = null;
  let isAction = false;

  switch (blockchainStatus) {
    case BET_BLOCKCHAIN_STATUS.STATUS_MAKER_SHOULD_UNINIT:
      label = BETTING_STATUS_LABEL.CANCEL;
      strStatus = BETTING_STATUS_LABEL.SHOULD_CANCEL;
      isAction = true;
      break;
    case BET_BLOCKCHAIN_STATUS.STATUS_MAKER_UNINITED:
      strStatus = BETTING_STATUS_LABEL.CANCELLED;
      break;
    default: // !isMatch && role === ROLE.INITER && blockchainStatus === BET_BLOCKCHAIN_STATUS.STATUS_INITED)
      label = BETTING_STATUS_LABEL.CANCEL;
      strStatus = BETTING_STATUS_LABEL.BET_WAIT_MATCHING;
      isAction = true;
      break;
  }
  return { title: label, isAction, status: strStatus };
}

const refundAction = (blockchainStatus) => {
  let label = null;
  let strStatus = null;
  let isAction = false;
  switch (blockchainStatus) {
    case BET_BLOCKCHAIN_STATUS.STATUS_REFUND:
      strStatus = BETTING_STATUS_LABEL.REFUNDED;
      break;
    default:
      label = BETTING_STATUS_LABEL.REFUND;
      strStatus = BETTING_STATUS_LABEL.REFUNDING;
      isAction = true;
      break;
  }

  return { title: label, isAction, status: strStatus };
}


const matchAction = () => {

  const strStatus = BETTING_STATUS_LABEL.BET_MACHED_WAIT_RESULT;
  const isAction = false;

  return { title: null, isAction, status: strStatus };
}

const winOrLose = (resultStatus, side = SIDE.SUPPORT, disputeTime) => {

  let label = null;
  let strStatus = null;
  let isAction = false;
  // Win
  if (resultStatus === side) {
    if (isExpiredDate(disputeTime)) { // Over dispute time, user can withdraw
      label = BETTING_STATUS_LABEL.WITHDRAW;
      strStatus = BETTING_STATUS_LABEL.WIN;
      isAction = true;
    } else {
      strStatus = BETTING_STATUS_LABEL.WIN + BETTING_STATUS_LABEL.WIN_WAIT;
      isAction = true;
    }
  } else { // LOSE
    strStatus = BETTING_STATUS_LABEL.LOSE;
  }

  return { title: label, isAction, status: strStatus };
}

const doneAction = () => {
    const strStatus = BETTING_STATUS_LABEL.COLLECT_DONE;
    const isAction = false;

    return { title: null, isAction, status: strStatus };

}

const rollbackAction = () => {
  const strStatus = BETTING_STATUS_LABEL.ROLLBACK;
  const isAction = false;
  return { title: null, isAction, status: strStatus };
}

