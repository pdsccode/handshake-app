
import Handshake from '@/models/Handshake';
import { BETTING_ACTIONS } from './action';
import Match from '@/models/Match';

const handleMatchListPayload = payload => payload.map(item => Match.match(item));

const bettingReducter = (state = {
  matches: [],
  supports: [],
  against: [],
  isFetching: false
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
      case BETTING_ACTIONS.LOAD_HANDSHAKES:
      return {
        ...state,
        isFetching: true,
      };
      case `${BETTING_ACTIONS.LOAD_HANDSHAKES}_SUCCESS`:
      return {
        ...state,
        isFetching: true,
        supports: action.payload.data.support,
        against: action.payload.data.against,
      };
      case `${BETTING_ACTIONS.LOAD_HANDSHAKES}_FAILED`:
      return {
        ...state,
        isFetching: true,
      };
    default:
      return state;
  }
};

export default bettingReducter;
