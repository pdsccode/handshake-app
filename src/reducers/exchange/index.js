import {EXCHANGE_ACTIONS} from './action';

function exchangeReducter(state = null, action) {
  switch (action.type) {
    case EXCHANGE_ACTIONS.LOAD_OFFERS_SUCCESS: {
      return state;
    }
    default:
      return state;
  }
}

export default exchangeReducter;
