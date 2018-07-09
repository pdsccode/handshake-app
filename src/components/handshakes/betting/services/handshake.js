import { BettingHandshake } from '@/services/neuron';
import { API_URL } from '@/constants';
import { showAlert } from '@/reducers/app/action';
import { PredictionHandshake } from '@/services/neuron';
import { getMessageWithCode, getChainIdDefaultWallet, isInitBet, isExpiredDate } from '@/components/handshakes/betting/utils';
import GA from '@/services/google-analytics';

import { rollback, saveTransaction } from '@/reducers/handshake/action';

import store from '@/stores';

import { BETTING_STATUS_LABEL, BET_BLOCKCHAIN_STATUS, BETTING_STATUS, SIDE, CONTRACT_METHOD } from '@/components/handshakes/betting/constants';

const instance = null;

export class HandshakeService {
  static getShareManager() {
    if (this.instance == null) {
      console.log('Create new instance');
      this.instance = new HandshakeService();
    }

    return this.instance;
  }
  constructor() {
    this.listOnChainLoading = {};
  }
  static getStatusLabel(blockchainStatus, resultStatus, role, side, isMatch, reportTime, disputeTime) {
    let label = null;
    let strStatus = null;
    let isAction = false;
    console.log('getStatusLabel Role:', role);
    console.log('getStatusLabel isMatch:', isMatch);
    console.log('getStatusLabel Blockchain status:', blockchainStatus);
    if (blockchainStatus === BET_BLOCKCHAIN_STATUS.STATUS_INIT_FAILED) {
      strStatus = BETTING_STATUS_LABEL.INIT_FAILED;
      isAction = false;
    } else if (blockchainStatus === BET_BLOCKCHAIN_STATUS.STATUS_COLLECT_FAILED) {
      label = BETTING_STATUS_LABEL.CANCEL;
      strStatus = BETTING_STATUS_LABEL.COLLECT_FAILED;
      isAction = true;
    } else if (blockchainStatus === BET_BLOCKCHAIN_STATUS.STATUS_MAKER_UNINIT_PENDING
      || blockchainStatus === BET_BLOCKCHAIN_STATUS.STATUS_COLLECT_PENDING) {
      strStatus = BETTING_STATUS_LABEL.PROGRESSING;
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
    } else if ((blockchainStatus === BET_BLOCKCHAIN_STATUS.STATUS_DONE && resultStatus === BETTING_STATUS.SUPPORT_WIN && side === SIDE.SUPPORT)
      || (blockchainStatus === BET_BLOCKCHAIN_STATUS.STATUS_DONE && resultStatus === BETTING_STATUS.AGAINST_WIN && side === SIDE.AGAINST)) {
      strStatus = BETTING_STATUS_LABEL.WIN + BETTING_STATUS_LABEL.DONE;
      isAction = false;
    } else if (!isMatch && role === ROLE.INITER && blockchainStatus !== BET_BLOCKCHAIN_STATUS.STATUS_SHAKER_SHAKED) {
      label = BETTING_STATUS_LABEL.CANCEL;
      strStatus = BETTING_STATUS_LABEL.BET_WAIT_MATCHING;
      isAction = true;
    } else if ((isMatch && resultStatus === BETTING_STATUS.DRAW)
      || (isMatch && resultStatus === BETTING_STATUS.INITED && isExpiredDate(reportTime))) {
      label = BETTING_STATUS_LABEL.REFUND;
      strStatus = BETTING_STATUS_LABEL.REFUNDING;
      isAction = true;
    } else if ((isMatch && resultStatus === BETTING_STATUS.SUPPORT_WIN && side === SIDE.SUPPORT)
      || (isMatch && resultStatus === BETTING_STATUS.AGAINST_WIN && side === SIDE.AGAINST)) {
      if (isExpiredDate(disputeTime)) { // Over dispute time, user can withdraw
        label = BETTING_STATUS_LABEL.WITHDRAW;
        strStatus = BETTING_STATUS_LABEL.WIN;
        isAction = true;
      } else { //
        strStatus = BETTING_STATUS_LABEL.WIN + BETTING_STATUS_LABEL.WIN_WAIT;
        isAction = true;
      }
    } else if ((isMatch && resultStatus === BETTING_STATUS.SUPPORT_WIN && side === SIDE.AGAINST)
      || (isMatch && resultStatus === BETTING_STATUS.AGAINST_WIN && side === SIDE.SUPPORT)) {
      strStatus = BETTING_STATUS_LABEL.LOSE;
      isAction = false;
    } else if (isMatch || blockchainStatus === BET_BLOCKCHAIN_STATUS.STATUS_SHAKER_SHAKED) {
      strStatus = BETTING_STATUS_LABEL.BET_MACHED_WAIT_RESULT;
      isAction = false;
    }
    return { title: label, isAction, status: strStatus };
  }

  addContract = async (item) => {
    console.log('initContract', item);

    const {
      amount, odds, side, offchain, hid,
    } = item;
    const stake = Math.floor(amount * 10 ** 18) / 10 ** 18;
    // hid = 10000;
    const chainId = getChainIdDefaultWallet();
    const bettinghandshake = new BettingHandshake(chainId);
    const contractAddress = bettinghandshake.contractAddress;
    let realBlockHash = '';
    let logJson = '';
    let dataBlockchain = '';
    try {
      dataBlockchain = await bettinghandshake.initBet(hid, side, stake, odds, offchain);
      // TO DO: SAVE TRANSACTION
      const {
        logs, hash, error, transactionHash, payload,
      } = dataBlockchain;
      logJson = payload;
      realBlockHash = hash;
      if (hash == -1) {
        realBlockHash = '-1';

        logJson = error.message;
        this.rollback(offchain);
      }

      // Send GA event tracking
      try {
        if (hash === -1) {
          GA.createBetNotMatchFail({
            side,
            odds,
            amount,
            message: logJson,
          });
        } else {
          GA.createBetNotMatchSuccess({ side, odds, amount });
        }
      } catch (err) {
        console.log(err);
      }
    } catch (e) {
      realBlockHash = '-1';
      logJson = e.message;
    }

    this.saveTransaction(offchain, CONTRACT_METHOD.INIT, chainId, realBlockHash, contractAddress, logJson);
    return dataBlockchain;
  };

  async shakeContract(item) {
    console.log('shakeContract', item);

    const {
      amount, id, odds, side, maker_address, maker_odds, offchain, hid,
    } = item;
    // hid = 10000;
    const stake = Math.floor(amount * 10 ** 18) / 10 ** 18;

    const maker = maker_address;
    const makerOdds = maker_odds;
    const chainId = getChainIdDefaultWallet();
    const bettinghandshake = new BettingHandshake(chainId);
    const contractAddress = bettinghandshake.contractAddress;
    let realBlockHash = '';
    let logJson = '';
    let result = '';
    try {
      result = await bettinghandshake.shake(
        hid,
        side,
        stake,
        odds,
        maker,
        makerOdds,
        offchain,
      );
      const {
        logs, hash, error, transactionHash, payload,
      } = result;

      logJson = payload;
      realBlockHash = hash;
      if (hash == -1) {
        realBlockHash = '-1';
        logJson = error.message;
        this.rollback(offchain);
      }

      // Send GA event tracking
      try {
        if (hash === -1) {
          GA.createBetMatchedFail({
            side,
            odds,
            amount,
            message: logJson,
          });
        } else {
          GA.createBetMatchedSuccess({ side, odds, amount });
        }
      } catch (err) { }
    } catch (e) {

    }

    this.saveTransaction(offchain, CONTRACT_METHOD.SHAKE, chainId, realBlockHash, contractAddress, logJson);

    return result;
  }


  handleContract(element, i) {
    setTimeout(() => {
      console.log('Time out:');
      const { offchain, odds } = element;
      const isInit = isInitBet(element);
      console.log('Is Init Bet:', isInit);
      if (isInit) {
        this.addContract(element);
      } else {
        this.shakeContract(element);
      }
    }, 3000 * i);


    /*
   const { offchain, odds } = element;
   const isInit = isInitBet(element);
   console.log('Is Init Bet:', isInit);
   if (isInit) {
     this.addContract(element);
   } else {

   this.shakeContract(element);

   }
   */
  }
  controlShake = async (list) => {
    const result = null;

    for (let i = 0; i < list.length; i++) {
      const element = list[i];
      console.log('Element:', element);

      this.handleContract(element, i);
    }
  };


  async cancelBet(hid, side, stake, odds, offchain) {
    const chainId = getChainIdDefaultWallet();

    const bettinghandshake = new BettingHandshake(chainId);
    const contractAddress = bettinghandshake.contractAddress;

    let logJson = '';
    let realBlockHash = '';
    let result = null;
    try {
      result = await bettinghandshake.cancelBet(hid, side, stake, odds, offchain);
      const {
        logs, hash, error, transactionHash, payload,
      } = result;

      logJson = payload;
      realBlockHash = hash;
      if (hash == -1) {
        realBlockHash = '-1';
        logJson = error.message;
        store.dispatch(showAlert({
          message: MESSAGE.ROLLBACK,
          timeOut: 3000,
          type: 'danger',
          callBack: () => {
          },
        }));
      } else {

      }
    } catch (err) {
      realBlockHash = '-1';
      logJson = err.message;
    }
    this.saveTransaction(offchain, CONTRACT_METHOD.CANCEL, chainId, realBlockHash, contractAddress, logJson);

    return result;
  }
  getLoadingOnChain = offchain => this.listOnChainLoading[offchain]
  setItemOnChain = (offchain, itemOnChain) => {
    if (this.listOnChainLoading) {
      this.listOnChainLoading[offchain] = {
        itemOnChain,
      };
    }
  }
  async withdraw(hid, offchain) {
    const chainId = getChainIdDefaultWallet();

    const bettinghandshake = new BettingHandshake(chainId);
    const contractAddress = bettinghandshake.contractAddress;

    let result = null;

    let logJson = '';
    let realBlockHash = '';
    try {
      result = await bettinghandshake.withdraw(hid, offchain);
      const {
        logs, hash, error, transactionHash, payload,
      } = result;
      logJson = payload;
      realBlockHash = hash;
      if (hash == -1) {
        realBlockHash = '-1';
        logJson = error.message;
        store.dispatch(showAlert({
          message: MESSAGE.ROLLBACK,
          timeOut: 3000,
          type: 'danger',
          callBack: () => {
          },
        }));
      } else {
        store.dispatch(showAlert({
          message: MESSAGE.WITHDRAW_SUCCESS,
          timeOut: 3000,
          type: 'success',
          callBack: () => {
          },
        }));
      }
    } catch (err) {
      console.log('Withdraw Error:', err);
      realBlockHash = '-1';
      logJson = err.message;
    }

    this.saveTransaction(offchain, CONTRACT_METHOD.COLLECT, chainId, realBlockHash, contractAddress, logJson);

    return result;
  }
  async refund(hid, offchain) {
    /*
    const chainId = getChainIdDefaultWallet();
    const bettinghandshake = new BettingHandshake(chainId);
    const result = await bettinghandshake.refund(hid, offchain);
    const {
      logs, hash, error, transactionHash,
    } = result;
    let logJson = JSON.stringify(logs);
    const contractAddress = bettinghandshake.contractAddress;
    let realBlockHash = hash;
    if (hash == -1) {
      realBlockHash = '-1';
      logJson = error.message;
      this.rollback(offchain);
    }
    this.saveTransaction(offchain, CONTRACT_METHOD.REFUND, chainId, realBlockHash, contractAddress, logJson);

    return result;
    */
    const chainId = getChainIdDefaultWallet();

    const bettinghandshake = new BettingHandshake(chainId);
    const contractAddress = bettinghandshake.contractAddress;

    let logJson = '';
    let realBlockHash = '';
    let result = null;
    try {
      result = await bettinghandshake.refund(hid, offchain);
      const {
        logs, hash, error, transactionHash, payload,
      } = result;

      logJson = payload;
      realBlockHash = hash;
      if (hash == -1) {
        realBlockHash = '-1';
        logJson = error.message;
        store.dispatch(showAlert({
          message: MESSAGE.ROLLBACK,
          timeOut: 3000,
          type: 'danger',
          callBack: () => {
          },
        }));
      } else {

      }
    } catch (err) {
      realBlockHash = '-1';
      logJson = err.message;
    }
    this.saveTransaction(offchain, CONTRACT_METHOD.CANCEL, chainId, realBlockHash, contractAddress, logJson);

    return result;
  }

  saveTransaction(offchain, contractMethod, chainId, hash, contractAddress, payload) {
    console.log('saveTransaction:', offchain);
    const arrayParams = [];
    const params = {
      offchain,
      contract_address: contractAddress,
      contract_method: contractMethod,
      chain_id: chainId,
      hash,
      payload,
    };
    arrayParams.push(params);
    console.log('saveTransaction Params:', arrayParams);
    store.dispatch(saveTransaction({
      PATH_URL: API_URL.CRYPTOSIGN.SAVE_TRANSACTION,
      METHOD: 'POST',
      data: arrayParams,
      successFn: this.saveTransactionSuccess,
      errorFn: this.saveTransactionFailed,
    }));
  }
  saveTransactionSuccess = async (successData) => {
    console.log('saveTransactionSuccess', successData);
  }
  saveTransactionFailed = (error) => {
    console.log('saveTransactionSuccess', error);
    const { status, code } = error;
    if (status == 0) {
      const message = getMessageWithCode(code);
      store.dispatch(showAlert({
        message,
        timeOut: 5000,
        type: 'danger',

      }));
    }
  }

  rollback(offchain) {
    console.log('Rollback:', offchain);
    const params = {
      offchain,
    };
    store.dispatch(rollback({
      PATH_URL: API_URL.CRYPTOSIGN.ROLLBACK,
      METHOD: 'POST',
      data: params,
      successFn: this.rollbackSuccess,
      errorFn: this.rollbackFailed,
    }));
  }
  rollbackSuccess = async (successData) => {
    console.log('rollbackSuccess', successData);
    store.dispatch(showAlert({
      message: MESSAGE.ROLLBACK,
      timeOut: 5000,
      type: 'danger',

    }));
  }
  rollbackFailed = (error) => {
    console.log('rollbackFailed', error);
    const { status, code } = error;
    if (status == 0) {
      const message = getMessageWithCode(code);
      store.dispatch(showAlert({
        message,
        timeOut: 5000,
        type: 'danger',

      }));
    }
  }
  async createMarket(fee, source, closingWindow, reportWindow, disputeWindow, offchain) {
    console.log(fee, source, closingWindow, reportWindow, disputeWindow, offchain);
    const chainId = getChainIdDefaultWallet();
    // const bettinghandshake = new BettingHandshake(chainId);
    const predictionhandshake = new PredictionHandshake(chainId);

    const contractAddress = predictionhandshake.contractAddress;
    let realBlockHash = '';
    let logJson = '';
    let result = '';
    const offchainString = `cryptosign_createMarket${offchain}`;
    try {
      result = await predictionhandshake.createMarket(fee, source, closingWindow, reportWindow, disputeWindow, offchain);
      const {
        logs, hash, error, transactionHash, payload,
      } = result;

      logJson = payload;
      realBlockHash = hash;
      if (hash == -1) {
        realBlockHash = '-1';
        logJson = error.message;
        store.dispatch(showAlert({
          message: MESSAGE.ROLLBACK,
          timeOut: 3000,
          type: 'danger',
          callBack: () => {
          },
        }));
      }
    } catch (err) {
      realBlockHash = '-1';
      logJson = err.message;
    }
    this.saveTransaction(offchainString, CONTRACT_METHOD.CREATE_MARKET, chainId, realBlockHash, contractAddress, logJson);
    return result;
  }
}

export default HandshakeService;
