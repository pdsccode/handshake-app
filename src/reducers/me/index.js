import Handshake from '@/models/Handshake';
import {ACTIONS} from './action';
import {HANDSHAKE_EXCHANGE_CC_STATUS_VALUE, HANDSHAKE_EXCHANGE_STATUS_VALUE} from "@/constants";
const firebase = require('firebase');

const handleListPayload = payload => payload.map(handshake => Handshake.handshake(handshake));

const handleDetailPayload = payload => Handshake.handshake(payload.data);

const meReducter = (state = {
  list: [],
  detail: {},
  isFetching: false,
}, action) => {
  switch (action.type) {
    // List
    case ACTIONS.LOAD_MY_HANDSHAKE:
      return {
        ...state,
        isFetching: true,
      };
    case `${ACTIONS.LOAD_MY_HANDSHAKE}_SUCCESS`:
      return {
        ...state,
        isFetching: false,
        list: handleListPayload(action.payload.data.handshakes),
      };
    case `${ACTIONS.LOAD_MY_HANDSHAKE}_FAILED`:
      return {
        ...state,
        isFetching: false,
      };

    // Detail
    case ACTIONS.LOAD_DETAIL:
      return {
        ...state,
        isFetching: true,
      };
    case `${ACTIONS.LOAD_MY_HANDSHAKE_DETAIL}_SUCCESS`:
      return {
        ...state,
        isFetching: false,
        detail: handleDetailPayload(action.payload),
      };
    case `${ACTIONS.LOAD_MY_HANDSHAKE_DETAIL}_FAILED`:
      return {
        ...state,
        isFetching: false,
      };
    case ACTIONS.FIREBASE_EXCHANGE_DATA_CHANGE: {
      const listOfferStatus = action.payload;
      let myList = state.list;

      Object.keys(listOfferStatus).forEach((offer_id) => {
        const offer = listOfferStatus[offer_id];
        for (let handshake of myList) {

          let status = '';
          if (offer.type === 'instant') {
            status = HANDSHAKE_EXCHANGE_CC_STATUS_VALUE[offer.status];
          } else if (offer.type === 'exchange') {
            status = HANDSHAKE_EXCHANGE_STATUS_VALUE[offer.status];
          }

          if (handshake.id.includes(offer.id) && handshake.status !== status) {
            handshake.status = status;
            break;
          }
        }
      });

      return {
        ...state,
        list: myList,
      };
    }
   

    case ACTIONS.FIREBASE_BETTING_DATA_CHANGE: {
      const listBettingStatus = action.payload;
      let myList = state.list;
    
      Object.keys(listBettingStatus).forEach((key) => {
        const element = listBettingStatus[key];
        const {id, status_i, result_i} = element;
        console.log('New id, status, result:', id, status_i, result_i);
        for (let handshake of myList) {
          if (handshake.id === id) {
            console.log('Found handshake', handshake);
            handshake.status = status_i;
            handshake.result = result_i;
            break;
          }
         
        }
        // const handshakeItem = myList.find(item => item.id === id);
        // handshakeItem.status = status_i;
        // handshakeItem.result = result_i;
        // //TO DO: delete record after update status 
        
      });
      

      return {
        ...state,
        list: myList,
      };
    }

    default:
      return state;
  }
};

export default meReducter;
