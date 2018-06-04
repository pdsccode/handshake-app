import {MasterWallet} from '@/models/MasterWallet';
import { BettingHandshake } from '@/services/neuron';
import { APP } from '@/constants';

import local from '@/services/localStore';

const wallet = MasterWallet.getWalletDefault('ETH');
const chainId = wallet.chainId;
console.log('Chain Id:', chainId);

const bettinghandshake = new BettingHandshake(chainId);

export const BET_BLOCKCHAIN_STATUS = {
    STATUS_PENDING: -1,
    STATUS_INITED: 0,
    STATUS_MAKER_UNINITED: 1,
    STATUS_SHAKER_SHAKED: 2,
    STATUS_REFUND: 3,
    STATUS_DONE: 4,
    STATUS_BLOCKCHAIN_PENDING: -4,
}

export const ROLE = {
  INITER: 1,
  SHAKER: 2,
};

export const SIDE = {
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
    {  INITING: 'Your bet is initing...',  CANCEL: 'Cancel', "LOSE": 'Sorry, you lost', "WIN": 'Congrats, you won!','DONE': 'Completed',
    WITHDRAW: 'Withdraw', 'WAITING_RESULT': 'Match is ongoing', 'REFUND': 'Refund', CANCELLED: 'The bet is cancelled', REFUNDED: 'You got the refund'}

export class BetHandshakeHandler {
    static getStatusLabel(blockchainStatus, resultStatus, role, side, isMatch){
        var label = null;
        var strStatus = null;
        var isAction = false;
        console.log('Role:', role);
        console.log('isMatch:', isMatch);
        console.log('Blockchain status:', blockchainStatus);
        if(blockchainStatus === BET_BLOCKCHAIN_STATUS.STATUS_PENDING){
          strStatus = BETTING_STATUS_LABEL.INITING;
          isAction = false;
        }else if (blockchainStatus === BET_BLOCKCHAIN_STATUS.STATUS_MAKER_UNINITED){
          strStatus = BETTING_STATUS_LABEL.CANCELLED;
          isAction = false;
        }else if (blockchainStatus === BET_BLOCKCHAIN_STATUS.STATUS_REFUND){
          strStatus = BETTING_STATUS_LABEL.REFUNDED;
          isAction = false;
        }else if (blockchainStatus === BET_BLOCKCHAIN_STATUS.STATUS_BLOCKCHAIN_PENDING){
          //TO DO: scan txhash and rollback after a few minutes
          strStatus = "Waiting...";
          isAction = false;
        }else if(!isMatch && role === ROLE.INITER){
            label = BETTING_STATUS_LABEL.CANCEL;
            strStatus = BETTING_STATUS_LABEL.WAITING_RESULT;
            isAction = true;
        }else if(isMatch && resultStatus === BETTING_STATUS.DRAW){
            label = BETTING_STATUS_LABEL.WITHDRAW;
            strStatus = BETTING_STATUS_LABEL.WIN;
            isAction = true;
        }else if(isMatch && resultStatus === BETTING_STATUS.SUPPORT_WIN && side === SIDE.SUPPORT){
            label = BETTING_STATUS_LABEL.WITHDRAW;
            strStatus = BETTING_STATUS_LABEL.WIN;
            isAction = true;
        }else if(isMatch && resultStatus === BETTING_STATUS.SUPPORT_WIN && side === SIDE.AGAINST){
            //label = BETTING_STATUS_LABEL.LOSE;
            strStatus = BETTING_STATUS_LABEL.LOSE;
            isAction = false;
        }else if(isMatch && resultStatus === BETTING_STATUS.AGAINST_WIN && side === SIDE.SUPPORT){
            //label = BETTING_STATUS_LABEL.LOSE;
            strStatus = BETTING_STATUS_LABEL.LOSE;
            isAction = false;
        }else if(isMatch && resultStatus === BETTING_STATUS.AGAINST_WIN && side === SIDE.AGAINST){
            label = BETTING_STATUS_LABEL.WITHDRAW;
            strStatus = BETTING_STATUS_LABEL.WIN;
            isAction = true;
        }else if(isMatch){
          strStatus = BETTING_STATUS_LABEL.WAITING_RESULT;
          isAction = false;
      }
        return {"title": label, "isAction": isAction, "status": strStatus};
  }

  static getId(idOffchain){
    const array = idOffchain.split("_");
    if(array.length > 1){
      const secondItem = array[1];
      if(secondItem){
        const strId = secondItem.substring(1);
        console.log(strId);
        return parseInt(strId);

      }
    }

  }

  static async getBalance(){
    const balance =  await wallet.getBalance();
    console.log('Balance:', balance);
    return balance;
  }

  static foundShakeItemList(dict){
    var shakerList = [];
    const profile = local.get(APP.AUTH_PROFILE);
    const {shakers, outcome_id, from_address} = dict;
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
  static addContract(item, hid){
    console.log('initContract:', item);
    
    const {amount,id, odds, side, outcome_id, from_address, offchain} = item;
      const stake = amount;
      //const payout = stake * odds;
      const payout = Math.round(stake * odds*10**18)/10**18;
      const maker = from_address;
      //const hid = outcome_id;
    console.log(`hid:`, hid);
    bettinghandshake.initBet(hid, side,stake, payout, offchain);
      

  }

  static async shakeContract(item, hid){
    console.log('shakeContract:', item);

    const {amount,id, odds, side, outcome_id, from_address} = item;
      const stake = amount;
      //const payout = stake * odds;
      const payout = Math.round(stake * odds*10**18)/10**18;
      const offchain = `cryptosign_s${id}`;
      const maker = from_address;
      //const hid = outcome_id;
      const result = await bettinghandshake.shake(hid, side,stake, payout,maker, offchain);
      if(result){
          
      }
  }
  static async controlShake(list, hid){
    var result = null;
    
    list.forEach(element => {
       console.log('Element:', element);
       const isInitBet = BetHandshakeHandler.isInitBet(element)
       console.log("isInitBet:", isInitBet);
      if(isInitBet){
        this.addContract(element, hid);
      }else {
        const foundShakeList = BetHandshakeHandler.foundShakeItemList(element);
        foundShakeList.forEach(element => {
          this.shakeContract(element, hid);
        });

      }
      
    });
  }



  static async initContract(hid, side, stake, payout, offchain){
    result = await bettinghandshake.initBet(hid, side,stake, payout, offchain);
    return result;
  }

}
