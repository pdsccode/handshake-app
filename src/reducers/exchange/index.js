import {EXCHANGE_ACTIONS} from './action';

function exchangeReducter(state = {}, action) {
  console.log('exchangeReducter', JSON.stringify(action));
  switch (action.type) {
    case EXCHANGE_ACTIONS.GET_CRYPTO_PRICE_SUCCESS: {
      return {...state, cryptoPrice: action.payload.data};
    }
    case EXCHANGE_ACTIONS.GET_USER_CC_LIMIT_SUCCESS: {
      return {...state, userCcLimit: action.payload.data};
    }
    case EXCHANGE_ACTIONS.GET_CC_LIMITS_SUCCESS: {
      return {...state, ccLimits: action.payload.data};
    }
    case EXCHANGE_ACTIONS.GET_USER_PROFILE_SUCCESS: {
      return {...state, userProfile: action.payload.data};
    }
    default:
      return state;
  }
}

export default exchangeReducter;
