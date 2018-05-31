import Neuron from '@/services/neuron';
import {MasterWallet} from '@/models/MasterWallet';
import moment from 'moment';

const wallet = MasterWallet.getWalletDefault('ETH');
const chainId = wallet.chainId;
const address = wallet.address;
const privateKey = wallet.privateKey;

const neuron = new Neuron(chainId);


export const REJECT_WINDOWN_DAYS = 1;
export const CANCEL_WINDOWN_DAYS = 3;

export const BETTING_STATUS = {
    NOT_CREATE: -4, INITING: -1, INITED: 0, SHAKED: 1, CLOSED: 2, CANCELLED: 3,
    INITIATOR_WON: 4, BETOR_WON: 5, DRAW: 6, ACCEPTED: 7, REJECTED: 8, DONE: 9};


export const BETTING_STATUS_LABEL =
    { INITING: 'Initing',
    INITED: 'Inited', SHAKE: 'Shake', CLOSE: 'Close bet', CANCEL: 'Cancel',
    WITHDRAW: 'Withdraw', 'WAITING_RESULT': 'Waiting Result', REJECT: 'Reject', LOSE: 'Lose',
    RESOLVING: 'Resolving', PENDING: 'Pending', IN_PROGRESS:'Progressing', EXPIRED: 'Expired', DONE: 'Done'}

export const BETTING_OPTIONS = {
    INITIATOR_WON: 0, BETOR_WON: 1, DRAW: 2
}

export const BETTING_OPTIONS_NAME = {
    [BETTING_OPTIONS.INITIATOR_WON]: "Iniator Won", [BETTING_OPTIONS.BETOR_WON]: "Betor Won", [BETTING_OPTIONS.DRAW]: "Draw"
}
export const ROLE = {
    PAYEE: 0,
    PAYER: 1,
    GUEST: 2
  }

  export class BetHandshakeHandlerOld {

    static addDays(date, days) {
        var result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
      }
    static getStatusLabel(status, role, eventDate, shakeCount){

        if(status >= BETTING_STATUS.INITIATOR_WON && status <= BETTING_STATUS.DRAW){
            const windowRejectDate = this.addDays(eventDate,REJECT_WINDOWN_DAYS);
            console.log('windowRejectDate:', windowRejectDate);

            if(today > windowRejectDate){ // Qua ngày để reject, hiện kết quả lun
                console.log('there is a person choose result, over window reject Date');
                switch (status){
                    case BETTING_STATUS.INITIATOR_WON:
                    strStatus = (role === ROLE.PAYEE)? null : (role === ROLE.PAYER) ? BETTING_STATUS_LABEL.LOSE : BETTING_STATUS_LABEL.IN_PROGRESS; //If payeee = Withdraw, else payer = "lose" show button "Withdraw"
                    strAction = (role === ROLE.PAYEE) ? BETTING_STATUS_LABEL.WITHDRAW : null;
                    break;
                    case BETTING_STATUS.BETOR_WON:
                    strStatus = (role === ROLE.PAYEE) ? BETTING_STATUS_LABEL.LOSE : (role === ROLE.PAYER) ? null : BETTING_STATUS_LABEL.DONE; // If payee = "lose", else payer = "withdraw"
                    strAction = (role === ROLE.PAYEE) ? BETTING_STATUS_LABEL.WITHDRAW : null;
                    break;
                    case BETTING_STATUS.DRAW:
                    strStatus = (role === ROLE.GUEST) ? BETTING_STATUS_LABEL.DONE : null; // Both payee/payer = "withdraw"
                    strAction = (role !== ROLE.GUEST) ? BETTING_STATUS_LABEL.WITHDRAW : null;
                    break;
                }
                return {'status': strStatus, 'action': strAction, isShowOptions: false};

            }else {
                //TO DO: if that is who click status change to peding
                console.log('there is a person choose result');
                strStatus = (role === ROLE.GUEST) ? BETTING_STATUS_LABEL.IN_PROGRESS : null;
                strAction = (role !== ROLE.GUEST) ? BETTING_STATUS_LABEL.REJECT : null;
                return {'status': strStatus, 'action': strAction, isShowOptions: false};
            }
        }


        switch (status){
            case BETTING_STATUS.INITING:
            strStatus = BETTING_STATUS_LABEL.INITING; //All users
            strAction = null;
            break;
            case BETTING_STATUS.INITED:
            console.log('Event Date:', eventDate);
            console.log('Today: ', today);
            console.log('Inited');
            console.log('Event Date < Today:', (eventDate <= today) ? true : false);
            strStatus = (role !== ROLE.PAYEE && eventDate < today) ? BETTING_STATUS_LABEL.EXPIRED : null;
            strAction = (role === ROLE.PAYEE) ? BETTING_STATUS_LABEL.CLOSE : (eventDate >= today) ?  BETTING_STATUS_LABEL.SHAKE : null;

            break;
            case BETTING_STATUS.SHAKED:
            if (today <= eventDate){
                strStatus = null; //Check if payee = '', else payer = '' and show button Shake
                strAction = (role === ROLE.PAYEE) ? BETTING_STATUS_LABEL.CLOSE :  BETTING_STATUS_LABEL.SHAKE;
            }else {
                if(role!== ROLE.GUEST){
                    isShowOptions = true;
                }else{
                    strStatus = BETTING_STATUS_LABEL.IN_PROGRESS; //Check if payee = '', else payer = '' and show button Shake

                }
            }

            break;
            case BETTING_STATUS.CLOSED:
            if(shakeCount > 0){//SHAKE -> CLOSED -> there is a person shaked -> Waiting Result to indicate who win
                if(today <=eventDate){
                    strStatus = (role === ROLE.GUEST) ? BETTING_STATUS_LABEL.IN_PROGRESS : BETTING_STATUS_LABEL.WAITING_RESULT ; //payee & payer waiting result
                }else { //If today > evenDay, payee & payer choose who wins, guest see IN PROGRESS
                    if(role!== ROLE.GUEST){
                        isShowOptions = true;
                    }else{
                        strStatus = BETTING_STATUS_LABEL.IN_PROGRESS;
                    }
                }
            }else { //INITED -> CLOSE // No one shake -> Payee can withdraw immediately. Not care eventDate
                strStatus = (role !== ROLE.PAYEE) ? BETTING_STATUS_LABEL.IN_PROGRESS : null;
                strAction = (role === ROLE.PAYEE) ? BETTING_STATUS_LABEL.WITHDRAW : null;
            }
            break;
            case BETTING_STATUS.CANCELLED:
            strStatus = (role === ROLE.GUEST) ? BETTING_STATUS_LABEL.IN_PROGRESS : null;
            strAction = (role !== ROLE.GUEST) ? BETTING_STATUS_LABEL.WITHDRAW : null;
            break;
            case BETTING_STATUS.REJECTED: //There is a person click reject
            strStatus = (role !== ROLE.GUEST) ? BETTING_STATUS_LABEL.RESOLVING: BETTING_STATUS_LABEL.IN_PROGRESS;
            break;
            case BETTING_STATUS.ACCEPTED:
            //TO DO: chua biet xu ly, biet ai da rut tien.
            //Neu da rut tien: hien thi DONE, chua rut tien, hien thi WithDraw

            break;
            case BETTING_STATUS.DONE:
            strStatus = BETTING_STATUS_LABEL.DONE;
            break;
            default: // Not show status
            break;

        }


        console.log('Output Status:', strStatus);
        console.log('Output Action:', strAction);

        return {'status': strStatus, 'action': strAction, isShowOptions: isShowOptions};

    }

    static async initItem(escrow, odd, eventDate, offchain){
        //const address = "0x54CD16578564b9952d645E92b9fa254f1feffee9";
        //const privateKey = "9bf73320e0bcfd7cdb1c0e99f334d689ef2b6921794f23a5bffd2a6bb9c7a3d4";

        // const address = wallet.address;
        // const privateKey = wallet.privateKey;
        console.log("Address, PrivateKey:", address, privateKey);

        const acceptors = [];
        const goal = escrow*odd;
        const currentDate = moment();
        const deadline = (eventDate.unix() / 1000 - currentDate.unix() / 1000);
        console.log('Deadline:', deadline);
        const data = await neuron.bettingHandshake.initBet(address, privateKey, acceptors, goal, escrow, deadline, offchain);
        console.log('Init Betting:', data);
        return data;
    }
    static shakeItem(role, hid, amount, offchain){
        console.log('Shake Amount:',escrow);
        console.log('Balance:', balance);
        if (role === ROLE.PAYER || role === ROLE.GUEST){
            //handle shake item, for payee
            /*
            if balance = total amount => close bet
            if date > event date, payee can't shake
            User shake, deposit money into escrow. Return result
            */
           //Testing
           /*
           var today = new Date()
           if (today <= eventDate){
               // Change item to status
               let newItem = item;
               const newBalance = shakeAmount + balance;
                console.log('New Balance:',newBalance);
               if(newBalance < goal){
                newItem.status = BETTING_STATUS.SHAKED;
               }else {
                   newItem.status = BETTING_STATUS.CLOSED;
               }
               newItem.balance = newBalance;
               return newItem;
           }
           */
            //const address = "0x54CD16578564b9952d645E92b9fa254f1feffee9";
            //const privateKey = "9bf73320e0bcfd7cdb1c0e99f334d689ef2b6921794f23a5bffd2a6bb9c7a3d4";
            // const address = wallet.address;
            // const privateKey = wallet.privateKey;
            neuron.bettingHandshake.shake(address, privateKey,hid,amount, offchain);



        }
        return null;
    }

    static closeItem(role, hid, offchain){
        /*
        User tap Close Bet button or auto Close
        */
       if (role === ROLE.PAYEE){
            // TO DO: Change item to Close. Update status
            //Testing
            /*
            let newItem = item;
            newItem.status = BETTING_STATUS.CLOSED;
            return newItem;
            */
        //    const address = "0x54CD16578564b9952d645E92b9fa254f1feffee9";
        //    const privateKey = "9bf73320e0bcfd7cdb1c0e99f334d689ef2b6921794f23a5bffd2a6bb9c7a3d4";

           neuron.bettingHandshake.closeBet(address, privateKey,hid,offchain);
       }
       return null;
    }
    static rejectItem(role, hid, offchain){
        // const address = "0x54CD16578564b9952d645E92b9fa254f1feffee9";
        // const privateKey = "9bf73320e0bcfd7cdb1c0e99f334d689ef2b6921794f23a5bffd2a6bb9c7a3d4";
        if (role !== ROLE.GUEST){
            neuron.bettingHandshake.reject(address, privateKey,hid,offchain);

        }
    }

    static chooseWhoWin(option, role, hid, offchain){
        // const address = "0x54CD16578564b9952d645E92b9fa254f1feffee9";
        // const privateKey = "9bf73320e0bcfd7cdb1c0e99f334d689ef2b6921794f23a5bffd2a6bb9c7a3d4";
        switch(option){
            case BETTING_OPTIONS.BETOR_WON:
            neuron.bettingHandshake.betorWon(address, privateKey,hid,offchain);
            break;
            case BETTING_OPTIONS.INITIATOR_WON:
            neuron.bettingHandshake.iniatorWon(address, privateKey,hid,offchain);
            break;
            default://Draw
            neuron.bettingHandshake.draw(address, privateKey,hid,offchain);

        }
    }
    static withdraw(role, hid, offchain){
        if (role !== ROLE.GUEST){
            // const address = "0x54CD16578564b9952d645E92b9fa254f1feffee9";
            // const privateKey = "9bf73320e0bcfd7cdb1c0e99f334d689ef2b6921794f23a5bffd2a6bb9c7a3d4";
            neuron.bettingHandshake.withdraw(address, privateKey,hid,offchain);
        }
    }

    static autoCancel(role,evendate, state, hid, offchain){
        // const address = "0x54CD16578564b9952d645E92b9fa254f1feffee9";
        // const privateKey = "9bf73320e0bcfd7cdb1c0e99f334d689ef2b6921794f23a5bffd2a6bb9c7a3d4";
        if (role !== ROLE.GUEST){
            if(state === BETTING_STATUS.SHAKED || state === BETTING_STATUS.CLOSED){
                var today = new Date()
                if (today > evendate + CANCEL_WINDOWN_DAYS){
                    neuron.bettingHandshake.cancelBet(address, privateKey,hid,offchain);
                  }
                }
              }
      }
}
