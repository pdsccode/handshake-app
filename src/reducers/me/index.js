import Handshake from '@/models/Handshake';
import { ACTIONS } from './action';

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
    case ACTIONS.FIREBASE_DATA_CHANGE: {
      console.log('ACTIONS.FIREBASE_DATA_CHANGE', action);

      const listOfferStatus = action.payload.data;
      let myList = state.list;
      console.log('myList old', myList);
      for (const offer of listOfferStatus) {
          for (let handshake of myList) {
          if (handshake.id.includes(offer.id)) {
            handshake.status = offer.status;
            break;
          }
        }
      }

      console.log('myList', myList);
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
