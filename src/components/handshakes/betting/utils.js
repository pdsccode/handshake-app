import { MasterWallet } from '@/services/Wallets/MasterWallet';
import { BettingHandshake } from '@/services/neuron';
import local from '@/services/localStore';
import moment from 'moment';
import { APP } from '@/constants';
import { BET_TYPE, MESSAGE_SERVER, MESSAGE } from '@/components/handshakes/betting/Feed/BetHandshakeHandler';
import {BigNumber} from 'bignumber.js';
import _ from 'lodash';
export const parseBigNumber = (value)=>{
  return new BigNumber(value);
}
export const getMessageWithCode= (code)=> {
    const keys = Object.keys(MESSAGE_SERVER).filter(k => k == code); // ["A", "B"]
    console.log('Keys:', keys);
    const value = keys.map(k => MESSAGE_SERVER[k]); // [0, 1]
    console.log('Message:', value);
    return value;
  }
export const getChainIdDefaultWallet = () => {
  const wallet = MasterWallet.getWalletDefault('ETH');
  const { chainId } = wallet;
  return chainId;
};

export const getAddress = () => {
  const chainId = getChainIdDefaultWallet();
  const bettinghandshake = new BettingHandshake(chainId);
  return bettinghandshake.address;
};


export const isSameAddress = (address) => {
  const currentAddress = getAddress();
  if (address !== currentAddress) {
    return false;
  }
  return true;
};

export const isRightNetwork = () => {
  const wallet = MasterWallet.getWalletDefault('ETH');
  MasterWallet.log(MasterWallet.getWalletDefault('ETH'));

  if (process.env.isStaging) {
    return true;
  }
  if (process.env.isProduction) {
    if (wallet.network === MasterWallet.ListCoin[wallet.className].Network.Mainnet) {
      return true;
    }
    return false;
  }
  return true;
};

export const isExpiredDate = (reportTime) => {
  // const newClosingDate = moment.unix(closingDate).add(90, 'minutes');
  console.log('Report Time:', reportTime);
  const newClosingDate = moment.unix(reportTime);
  const dayUnit = newClosingDate.utc();
  const today = moment();
  const todayUnit = today.utc();
  // console.log('Closing Unix:', closingDateUnit.format());
  console.log('New Date Unix:', dayUnit.format());
  console.log('Today Unix:', todayUnit.format());
  if (!todayUnit.isSameOrBefore(dayUnit, 'miliseconds') && today) {
    console.log('Expired Date');
    return true;
  }
  return false;
};

export const getId = (idOffchain) => {
  const array = idOffchain.split('_');
  if (array.length > 1) {
    const secondItem = array[1];
    if (secondItem) {
      const strId = secondItem.substring(1);
      return parseInt(strId, 10); // ID is not a value
    }
  }
  return null;
};

export const getShakeOffchain = id => `cryptosign_s${id}`;

export const getBalance = async () => {
  const wallet = MasterWallet.getWalletDefault('ETH');
  const balance = await wallet.getBalance();
  return balance;
};

export const getEstimateGas = async () => {
  const chainId = getChainIdDefaultWallet();
  const bettinghandshake = new BettingHandshake(chainId);
  const result = await bettinghandshake.getEstimateGas();
  return result;
};

export const foundShakeList = (item, offchain) => {
  // const shakerList = [];
  const profile = local.get(APP.AUTH_PROFILE);
  const { shakers, outcome_id, from_address } = item;

  const idOffchain = getId(offchain);
  console.log('Id Offchain:', idOffchain);
  if (!_.isEmpty(shakers)) {
    const shakersArr = JSON.parse(shakers);
    const shakedList = shakersArr.filter(element => element.shaker_id === profile.id);
    console.log('foundShakedList:', shakedList);
    return shakedList;

  }

  return [];
};
export const isExistMatchBet = (list) => {
  for (let i = 0; i < list.length; i += 1) {
    const element = list[i];

    const { type } = element;
    console.log('Sa element:', element);

    if (type === BET_TYPE.SHAKE) {
      return true;
    }
  }
  return false;
};

export const isInitBet = (dict) => {

  const { type } = dict;
  if (type === BET_TYPE.INIT) {
    return true;
  }
  return false;
};

export const validateBet = async (amount = 0, odds = 0, closingDate, matchName = '', matchOutcome = '', freeBet=false) => {
  const balance = await getBalance();
  const estimateGas = await getEstimateGas();
  const estimatedGasBN = parseBigNumber(estimateGas.toString()||0);
  const total = amount.plus(estimatedGasBN).toNumber()||0;
  let result = { status: true, message: '' };
  if (!isRightNetwork()) {
    result.message = MESSAGE.RIGHT_NETWORK;
    result.status = false;
    return result;
  }

  if (matchName.length === 0 || matchOutcome.length === 0) {
    result.message = MESSAGE.CHOOSE_MATCH;
    result.status = false;
    return result;
  }

  if (isExpiredDate(closingDate)) {
    result.message = MESSAGE.MATCH_OVER;
    result.status = false;
    return result;
  }
  if (amount <= 0) {
    result.message = MESSAGE.AMOUNT_VALID;
    result.status = false;
    return result;
  }

  if (total > balance && !freeBet) {
    result.message = MESSAGE.NOT_ENOUGH_BALANCE;
    result.status = false;
    return result;
  }

  if (odds <= 1 || odds >= 12) {
    result.message = MESSAGE.ODD_LARGE_THAN;
    result.status = false;
    return result;
  }
  return result;
};
