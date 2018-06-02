
import Handshake from '@/models/Handshake';
import { BETTING_ACTIONS } from './action';
import Match from '@/models/Match';

const handleMatchListPayload = payload => payload.map(item => Match.match(item));

const bettingReducter = (state = {
  matches: [],
  isFetching: false,
}, action) => {
  switch (action.type) {
    // Initial Handshake
    case BETTING_ACTIONS.LOAD_MATCHES:
      return {
        ...state,
        isFetching: true,
      };
    case `${BETTING_ACTIONS.LOAD_MATCHES}_SUCCESS`:
      return {
        ...state,
        isFetching: false,
        matches: action.payload.data,
      };
    case `${BETTING_ACTIONS.LOAD_MATCHES}_FAILED`:
      return {
        ...state,
        isFetching: false,
      };
    default:
      return state;
  }
};

export default bettingReducter;
