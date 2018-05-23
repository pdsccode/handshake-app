import {EXCHANGE_ACTIONS} from './action';

function exchangeReducter(state = null, action) {
  console.log('exchangeReducter', JSON.stringify(action));
  switch (action.type) {
    case EXCHANGE_ACTIONS.LOAD_OFFERS_SUCCESS: {
      return {...state, cryptoPrice: action.payload};
    }
    case EXCHANGE_ACTIONS.LOAD_OFFERS_FAILED: {
      return {...state, cryptoPrice: {}};
    }
    default:
      return state;
  }
}

export default exchangeReducter;
