import { DISCOVER_ACTIONS } from './action';
import localStore from '@/services/localStore';



const discoverReducter = (state = { isSigning: false }, action) => {
  switch (action.type) {
    case DISCOVER_ACTIONS.LOAD_DISCOVER:
      return {
        ...state,
        ...action.payload
      };
    case DISCOVER_ACTIONS.LOAD_DISCOVER_SUCCESS:
      return {
        ...state,
        ...action.payload
      };
    case DISCOVER_ACTIONS.LOAD_DISCOVER_FAILED:
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
}

export default discoverReducter;
