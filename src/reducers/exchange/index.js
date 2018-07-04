import { UserFactory, ExchangeFactory } from '@/factories';
import { EXCHANGE_ACTION } from '@/constants';
import { EXCHANGE_ACTIONS } from './action';

const initListOfferPrice = [];
initListOfferPrice.updatedAt = Date.now();

function exchangeReducer(state = {
  listOfferPrice: initListOfferPrice,
  freeStart: false,
}, action) {
  // console.log('exchangeReducer', JSON.stringify(action));
  switch (action.type) {
    case `${EXCHANGE_ACTIONS.GET_CRYPTO_PRICE}_SUCCESS`: {
      return { ...state, cryptoPrice: ExchangeFactory.cryptoPrice(action.payload.data) };
    }
    case `${EXCHANGE_ACTIONS.GET_USER_CC_LIMIT}_SUCCESS`: {
      return { ...state, userCcLimit: UserFactory.userCcLimit(action.payload.data) };
    }
    case `${EXCHANGE_ACTIONS.GET_CC_LIMITS}_SUCCESS`: {
      return { ...state, ccLimits: action.payload.data.map(ccLimit => UserFactory.ccLimit(ccLimit)) };
    }
    case `${EXCHANGE_ACTIONS.GET_USER_PROFILE}_SUCCESS`: {
      return { ...state, userProfile: UserFactory.userProfile(action.payload.data) };
    }
    case `${EXCHANGE_ACTIONS.GET_OFFER_PRICE}_SUCCESS`: {
      return { ...state, offerPrice: ExchangeFactory.offerPrice(action.payload.data) };
    }
    case `${EXCHANGE_ACTIONS.GET_USER_TRANSACTION}_SUCCESS`: {
      return { ...state, userTransaction: action.payload };
    }
    case `${EXCHANGE_ACTIONS.GET_LIST_OFFER_PRICE}_SUCCESS`: {
      const listOfferPrice = action.payload.data.map((offerPrice) => {
        const price = ExchangeFactory.offerPrice(offerPrice);

        price.type = price.type === EXCHANGE_ACTION.SELL ? EXCHANGE_ACTION.BUY : EXCHANGE_ACTION.SELL;

        return price;
      });
      listOfferPrice.updatedAt = Date.now();
      return {
        ...state,
        listOfferPrice,
      };
    }
    case `${EXCHANGE_ACTIONS.GET_IP_INFORM}_SUCCESS`: {
      return { ...state, ipInfo: action.payload.data };
    }
    case `${EXCHANGE_ACTIONS.GET_OFFER_STORES}_SUCCESS`: {
      return { ...state, offerStores: ExchangeFactory.offerShop(action.payload.data) };
    }
    case `${EXCHANGE_ACTIONS.GET_FREE_START_INFO}_SUCCESS`: {
      return { ...state, freeETH: action.payload.data ?.reward };
    }
    case `${EXCHANGE_ACTIONS.SET_FREE_START}`: {
      return { ...state, freeStart: action.payload.data };
    }
    default:
      return state;
  }
}

export default exchangeReducer;
