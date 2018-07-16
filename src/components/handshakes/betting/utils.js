import { MasterWallet } from '@/services/Wallets/MasterWallet';
import { BettingHandshake } from '@/services/neuron';
import local from '@/services/localStore';
import { APP } from '@/constants';
import { BET_TYPE } from '@/components/handshakes/betting/Feed/BetHandshakeHandler';
import { MESSAGE_SERVER } from '@/components/handshakes/betting/message.js';

import {BigNumber} from 'bignumber.js';
import _ from 'lodash';
export const parseBigNumber = (value)=>{
  return new BigNumber(value);
}
export const getMessageWithCode = (code)=> {
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
  const { shakers } = item;

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

