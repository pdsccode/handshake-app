import { BET_BLOCKCHAIN_STATUS, ROLE, SIDE, BETTING_RESULT } from '@/components/handshakes/betting/constants.js';
import { isExpiredDate } from '@/components/handshakes/betting/validation.js';
import { BETTING_STATUS_LABEL } from '@/components/handshakes/betting/message.js';


export const getStatusLabel = (blockchainStatus, resultStatus, role, side, isMatch, reportTime, disputeTime) => {
  let label = null;
  let strStatus = null;
  let isAction = false;
  console.log('getStatusLabel Role:', role);
  console.log('getStatusLabel isMatch:', isMatch);
  console.log('getStatusLabel Blockchain status:', blockchainStatus);
  console.log('getStatusLabel result:', resultStatus);

  if (blockchainStatus === BET_BLOCKCHAIN_STATUS.STATUS_INIT_FAILED) {
    strStatus = BETTING_STATUS_LABEL.INIT_FAILED;
    isAction = false;
  } else if (blockchainStatus === BET_BLOCKCHAIN_STATUS.STATUS_COLLECT_FAILED) {
    label = BETTING_STATUS_LABEL.CANCEL;
    strStatus = BETTING_STATUS_LABEL.COLLECT_FAILED;
    isAction = true;
  } else if (blockchainStatus === BET_BLOCKCHAIN_STATUS.STATUS_MAKER_SHOULD_UNINIT) {
    label = BETTING_STATUS_LABEL.CANCEL;
    strStatus = BETTING_STATUS_LABEL.SHOULD_CANCEL;
    isAction = true;
  } else if (blockchainStatus === BET_BLOCKCHAIN_STATUS.STATUS_MAKER_UNINIT_PENDING) {
    strStatus = BETTING_STATUS_LABEL.PROGRESSING;
    isAction = false;
  } else if (blockchainStatus === BET_BLOCKCHAIN_STATUS.STATUS_COLLECT_PENDING) {
    strStatus = BETTING_STATUS_LABEL.COLLECT_PENDING;
    isAction = false;
  } else if (blockchainStatus === BET_BLOCKCHAIN_STATUS.STATUS_MAKER_UNINIT_FAILED
            || blockchainStatus === BET_BLOCKCHAIN_STATUS.STATUS_REFUND_FAILED
            || blockchainStatus === BET_BLOCKCHAIN_STATUS.STATUS_DISPUTE_FAILED) {
    strStatus = BETTING_STATUS_LABEL.ACTION_FAILED;
    isAction = false;
  } else if (blockchainStatus === BET_BLOCKCHAIN_STATUS.STATUS_PENDING) {
    strStatus = BETTING_STATUS_LABEL.INITING;
    isAction = false;
  } else if (blockchainStatus === BET_BLOCKCHAIN_STATUS.STATUS_MAKER_UNINITED) {
    strStatus = BETTING_STATUS_LABEL.CANCELLED;
    isAction = false;
  } else if (blockchainStatus === BET_BLOCKCHAIN_STATUS.STATUS_MAKER_INIT_ROLLBACK) {
    strStatus = BETTING_STATUS_LABEL.ROLLBACK_INIT;
    isAction = false;
  } else if (blockchainStatus === BET_BLOCKCHAIN_STATUS.STATUS_SHAKER_ROLLBACK) {
    strStatus = BETTING_STATUS_LABEL.ROLLBACK_SHAKE;
    isAction = false;
  } else if (blockchainStatus === BET_BLOCKCHAIN_STATUS.STATUS_REFUND) {
    strStatus = BETTING_STATUS_LABEL.REFUNDED;
    isAction = false;
  } else if ((blockchainStatus === BET_BLOCKCHAIN_STATUS.STATUS_DONE && resultStatus === BETTING_RESULT.SUPPORT_WIN && side === SIDE.SUPPORT)
              || (blockchainStatus === BET_BLOCKCHAIN_STATUS.STATUS_DONE && resultStatus === BETTING_RESULT.AGAINST_WIN && side === SIDE.AGAINST)) {
    strStatus = BETTING_STATUS_LABEL.COLLECT_DONE;
    isAction = false;
  } else if (!isMatch && role === ROLE.INITER && blockchainStatus !== BET_BLOCKCHAIN_STATUS.STATUS_SHAKER_SHAKED) {
    label = BETTING_STATUS_LABEL.CANCEL;
    strStatus = BETTING_STATUS_LABEL.BET_WAIT_MATCHING;
    isAction = true;
  } else if ((isMatch && resultStatus === BETTING_RESULT.DRAW)
            || (isMatch && resultStatus === BETTING_RESULT.INITED && isExpiredDate(reportTime))) {
    label = BETTING_STATUS_LABEL.REFUND;
    strStatus = BETTING_STATUS_LABEL.REFUNDING;
    isAction = true;
  } else if ((isMatch && resultStatus === BETTING_RESULT.SUPPORT_WIN && side === SIDE.SUPPORT)
              || (isMatch && resultStatus === BETTING_RESULT.AGAINST_WIN && side === SIDE.AGAINST)) {
    if (isExpiredDate(disputeTime)) { // Over dispute time, user can withdraw
      label = BETTING_STATUS_LABEL.WITHDRAW;
      strStatus = BETTING_STATUS_LABEL.WIN;
      isAction = true;
    } else { //
      strStatus = BETTING_STATUS_LABEL.WIN + BETTING_STATUS_LABEL.WIN_WAIT;
      isAction = true;
    }
  } else if ((isMatch && resultStatus === BETTING_RESULT.SUPPORT_WIN && side === SIDE.AGAINST)
              || (isMatch && resultStatus === BETTING_RESULT.AGAINST_WIN && side === SIDE.SUPPORT)) {
    strStatus = BETTING_STATUS_LABEL.LOSE;
    isAction = false;
  } else if (isMatch || blockchainStatus === BET_BLOCKCHAIN_STATUS.STATUS_SHAKER_SHAKED) {
    strStatus = BETTING_STATUS_LABEL.BET_MACHED_WAIT_RESULT;
    isAction = false;
  }
  return { title: label, isAction, status: strStatus };
}
