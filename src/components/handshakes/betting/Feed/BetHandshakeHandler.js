import {MasterWallet} from '@/models/MasterWallet';
import { BettingHandshake } from '@/services/neuron';
import { APP } from '@/constants';

import local from '@/services/localStore';

const wallet = MasterWallet.getWalletDefault('ETH');
const chainId = wallet.chainId;
console.log('Chain Id:', chainId);

const bettinghandshake = new BettingHandshake(chainId);

export const SIDE = {
  GUEST: 0,
  SUPPORT: 1,
  AGAINST: 2,
};

export const BETTING_STATUS = {
  INITED: -1,
  DRAW: 0,
  SUPPORT_WIN: 1,
  AGAINST_WIN: 2,
};

export const BETTING_STATUS_LABEL =
    { CANCEL: 'Cancel', "LOSE": 'Sorry, you lost', "WIN": 'Congrats, you won!',
    WITHDRAW: 'Withdraw', 'WAITING_RESULT': 'Match is ongoing'}

export class BetHandshakeHandler {
    static getStatusLabel(status, role, isMatch){
        var label = null;
        var strStatus = null;
        var isAction = false;
        console.log('Role:', role);
        console.log('isMatch:', isMatch);

        if(!isMatch && role !== SIDE.GUEST){
            label = BETTING_STATUS_LABEL.CANCEL;
            strStatus = BETTING_STATUS_LABEL.WAITING_RESULT;
            isAction = true;
        }else if(isMatch && role !== SIDE.GUEST && status === BETTING_STATUS.INITED){
            label = BETTING_STATUS_LABEL.WAITING_RESULT;
            strStatus = BETTING_STATUS_LABEL.WAITING_RESULT;
            isAction = false;
        }else if(isMatch && role !== SIDE.GUEST && status === BETTING_STATUS.DRAW){
            label = BETTING_STATUS_LABEL.WITHDRAW;
            strStatus = BETTING_STATUS_LABEL.WIN;
            isAction = true;
        }else if(isMatch && status === BETTING_STATUS.SUPPORT_WIN && role === SIDE.SUPPORT){
            label = BETTING_STATUS_LABEL.WITHDRAW;
            strStatus = BETTING_STATUS_LABEL.WIN;
            isAction = true;
        }else if(isMatch && status === BETTING_STATUS.SUPPORT_WIN && role === SIDE.AGAINST){
            label = BETTING_STATUS_LABEL.LOSE;
            strStatus = BETTING_STATUS_LABEL.LOSE;
            isAction = false;
        }else if(isMatch && status === BETTING_STATUS.AGAINST_WIN && role === SIDE.SUPPORT){
            label = BETTING_STATUS_LABEL.LOSE;
            strStatus = BETTING_STATUS_LABEL.LOSE;
            isAction = false;
        }else if(isMatch && status === BETTING_STATUS.AGAINST_WIN && role === SIDE.AGAINST){
            label = BETTING_STATUS_LABEL.WITHDRAW;
            strStatus = BETTING_STATUS_LABEL.WIN;
            isAction = true;
        }
        return {"title": label, "isAction": isAction, "status": strStatus};
  }

  static async getBalance(){
    const balance =  await wallet.getBalance();
    console.log('Balance:', balance);
    return balance;
  }

  static foundShakeItemList(dict){
    var shakerList = [];
    const profile = local.get(APP.AUTH_PROFILE);
    const {shakers, outcome_id, from_address} = element;
      console.log('Shakers:', shakers);
      var foundShakedItem = shakers.find(function(element) {
        return element.shaker_id  === profile.id;
      });
      console.log('foundShakedItem:', foundShakedItem);
      if(foundShakedItem){
        foundShakedItem['outcome_id'] = outcome_id;
        foundShakedItem['from_address'] = from_address;
        shakerList.push(foundShakedItem);
      }
    return shakerList;
  }

  static isInitBet(dict){
    const profile = local.get(APP.AUTH_PROFILE);
    const {user_id} = dict;
    if(user_id && profile.id === user_id){
      return true;
    }
    return false;
  }
  static addContract(item){
    console.log('initContract:', item);
    
    const {amount,id, odds, side, outcome_id, from_address, offchain} = item;
      const stake = amount;
      const payout = stake * odds;
      const maker = from_address;
      const hid = outcome_id;
    bettinghandshake.initBet(hid, side,stake, payout, offchain);
      

  }

  static async shakeContract(item){
    console.log('shakeContract:', item);

    const {amount,id, odds, side, outcome_id, from_address} = item;
      const stake = amount;
      const payout = stake * odds;
      const offchain = `cryptosign_s${id}`;
      const maker = from_address;
      const hid = outcome_id;
      const result = await bettinghandshake.shake(hid, side,stake, payout,maker, offchain);
      if(result){
          
      }
  }
  static async controlShake(list){
    var result = null;
    
    list.forEach(element => {
       console.log('Element:', element);
       const isInitBet = BetHandshakeHandler.isInitBet(element)
       console.log("isInitBet:", isInitBet);
      if(isInitBet){
        this.addContract(element);
      }else {
        const foundShakeList = BetHandshakeHandler.foundShakeItemList(element);
        foundShakeList.forEach(element => {
          this.shakeContract(element);
        });

      }
      
    });
  }



  static async initContract(hid, side, stake, payout, offchain){
    result = await bettinghandshake.initBet(hid, side,stake, payout, offchain);
    return result;
  }

}
