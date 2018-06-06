import Handshake from '@/models/Handshake';
import { ACTIONS } from './action';
import { handShakeList } from '@/data/shake.js';
import {HANDSHAKE_EXCHANGE_STATUS_VALUE} from "@/constants";

const handleListPayload = payload => payload.map(handshake => Handshake.handshake(handshake));

const handleDetailPayload = payload => Handshake.handshake(handShakeList.data[1]);

const discoverReducter = (state = {
  list: [],
  detail: {},
  isFetching: false,
}, action) => {
  switch (action.type) {
    // List
    case ACTIONS.LOAD_DISCOVER:
      return {
        ...state,
        isFetching: true,
      };
    case `${ACTIONS.LOAD_DISCOVER}_SUCCESS`:
      return {
        ...state,
        isFetching: false,
        list: handleListPayload(action.payload.data.handshakes),
      };
    case `${ACTIONS.LOAD_DISCOVER}_FAILED`:
      return {
        ...state,
        isFetching: false,
      };

    // Detail
    case ACTIONS.LOAD_DISCOVER_DETAIL:
      return {
        ...state,
        isFetching: true,
      };
    case `${ACTIONS.LOAD_DISCOVER_DETAIL}_SUCCESS`:
      return {
        ...state,
        isFetching: false,
        detail: handleDetailPayload(action.payload),
      };
    case `${ACTIONS.LOAD_DISCOVER_DETAIL}_FAILED`:
      return {
        ...state,
        isFetching: false,
        detail: handleDetailPayload(action.payload), // temp, will delete when has API
      };
    case ACTIONS.UPDATE_OFFER_STATUS:
      const listOfferStatus = action.payload;
      let myList = state.list;

      Object.keys(listOfferStatus).forEach((offer_id) => {
        const offer = listOfferStatus[offer_id];
        for (let handshake of myList) {

          let status = HANDSHAKE_EXCHANGE_STATUS_VALUE[offer.status];

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

    default:
      return state;
  }
};

export default discoverReducter;
