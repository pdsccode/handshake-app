import { BET_BLOCKCHAIN_STATUS, ROLE, SIDE, BETTING_RESULT } from '@/components/handshakes/betting/constants.js';
import { isExpiredDate } from '@/components/handshakes/betting/validation.js';
import { BETTING_STATUS_LABEL } from '@/components/handshakes/betting/message.js';

import { BetHandshakeHandler } from '@/components/handshakes/betting/Feed/BetHandshakeHandler';

const TAG = 'STATUSACTION';

const betHandshakeHandler = BetHandshakeHandler.getShareManager();

export const getStatusLabel = (item) => {

  const {id, result, role, side, matched, reportTime, disputeTime} = item;
  let {status} = item;

  let label = null;
  let strStatus = null;
  let isAction = false;

  const itemLoading = keepCurrentLoading(item);
  status = itemLoading && itemLoading.status || status;

  console.log(TAG,'getStatusLabel', ' id:', id,
                  ' blockchainStatus:', status,
                  ' resultStatus:', result,
                  ' role:', role,
                  ' side:', side,
                  ' isMatch:', matched,
                  ' reportTime:', reportTime,
                  ' disputeTime:', disputeTime);



  if(status === BET_BLOCKCHAIN_STATUS.STATUS_INIT_FAILED
    || status === BET_BLOCKCHAIN_STATUS.STATUS_COLLECT_FAILED
    || status === BET_BLOCKCHAIN_STATUS.STATUS_MAKER_UNINIT_FAILED
    || status === BET_BLOCKCHAIN_STATUS.STATUS_REFUND_FAILED
    || status === BET_BLOCKCHAIN_STATUS.STATUS_DISPUTE_FAILED){
      //FAILED ACTION
      return failedAction(status);

  }

  if (status === BET_BLOCKCHAIN_STATUS.STATUS_INIT_PENDING
    || status === BET_BLOCKCHAIN_STATUS.STATUS_MAKER_UNINIT_PENDING
    || status === BET_BLOCKCHAIN_STATUS.STATUS_COLLECT_PENDING) {
      //PENDING ACTION
      return pendingAction(status);

  }

  if (status === BET_BLOCKCHAIN_STATUS.STATUS_MAKER_SHOULD_UNINIT
    || status === BET_BLOCKCHAIN_STATUS.STATUS_MAKER_UNINITED
    || (!matched && role === ROLE.INITER && status === BET_BLOCKCHAIN_STATUS.STATUS_INITED)) {
      //CANCEL ACTION
      return cancelAction(status);
  }

  if ((matched && result === BETTING_RESULT.DRAW && isExpiredDate(disputeTime))
      || (matched && result === BETTING_RESULT.INITED && isExpiredDate(reportTime))
      || status === BET_BLOCKCHAIN_STATUS.STATUS_REFUND) {
        //REFUND ACTION
      return refundAction(status, reportTime);
  }

  if (result > BETTING_RESULT.INITED && isExpiredDate(reportTime) && !isExpiredDate(disputeTime)) {
    return disputeAction(status);
  }

  if (result === BETTING_RESULT.INITED && // hasn't has result
      ((matched && status === BET_BLOCKCHAIN_STATUS.STATUS_INITED) //marker
     || (status === BET_BLOCKCHAIN_STATUS.STATUS_SHAKER_SHAKED))) { //shaker

      //MATCHED WAITING RESULT
      return matchAction();
  }

  if (matched && result > BETTING_RESULT.INITED && result < BETTING_RESULT.DRAW
    && status !== BET_BLOCKCHAIN_STATUS.STATUS_DONE) { //Has result and matched
      return winOrLose(result, side, disputeTime);
  }

  if (status === BET_BLOCKCHAIN_STATUS.STATUS_DONE) {
      return doneAction();
  }

  if (status === BET_BLOCKCHAIN_STATUS.STATUS_MAKER_INIT_ROLLBACK
    || status === BET_BLOCKCHAIN_STATUS.STATUS_SHAKER_ROLLBACK) {
      return rollbackAction();
    }

  return { title: label, isAction, status: strStatus };
}

const keepCurrentLoading = (item) => {
  const { id, status } = item;
  const isLoadingObj = betHandshakeHandler?.getLoadingOnChain(item.id);
  if (isLoadingObj) {

    if (status === BET_BLOCKCHAIN_STATUS.STATUS_MAKER_UNINITED || status === BET_BLOCKCHAIN_STATUS.STATUS_MAKER_UNINIT_FAILED
        || status === BET_BLOCKCHAIN_STATUS.STATUS_COLLECT_FAILED || status === BET_BLOCKCHAIN_STATUS.STATUS_REFUND_FAILED
        || status === BET_BLOCKCHAIN_STATUS.STATUS_DONE || status === BET_BLOCKCHAIN_STATUS.STATUS_REFUND) {
      betHandshakeHandler.setItemOnChain(id, null);
      return null;
    }

    const { itemOnChain } = isLoadingObj;
    return itemOnChain;
  }
  return null;
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

const refundAction = (blockchainStatus, reportTime) => {
  let label = null;
  let strStatus = null;
  let isAction = false;


  switch (blockchainStatus) {
    case BET_BLOCKCHAIN_STATUS.STATUS_REFUND:
      strStatus = BETTING_STATUS_LABEL.REFUNDED;
      break;
    default:
      if (!isExpiredDate(reportTime)) {
        strStatus = BETTING_STATUS_LABEL.REFUNDING + BETTING_STATUS_LABEL.REFUND_WAIT;
      } else {
        label = BETTING_STATUS_LABEL.REFUND;
        strStatus = BETTING_STATUS_LABEL.REFUNDING;
        isAction = true;
      }

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

const disputeAction = (blockchainStatus) => {
  let strStatus = null;
  let isAction = false;

  switch (blockchainStatus) {
    case BET_BLOCKCHAIN_STATUS.STATUS_DISPUTE_FAILED:
      strStatus = BETTING_STATUS_LABEL.DISPUTE_FAILED;
      break;
    case BET_BLOCKCHAIN_STATUS.STATUS_DISPUTE:
      strStatus = BETTING_STATUS_LABEL.DISPUTE_WAIT;
      break;
    default:
      strStatus = BETTING_STATUS_LABEL.DISPUTE;
      isAction = true;
      break;
  }

  return { title: null, isAction, status: strStatus };

}

