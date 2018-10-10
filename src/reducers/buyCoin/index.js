/* eslint camelcase:0 */

import BuyCryptoCoinModel from '@/models/BuyCryptoCoin';
import { BUY_COIN_ACTIONS } from './action';

const initialState = {
  coinInfo: {},
  basePrice: {},
  bankInfo: {},
};

const buyCoinReducter = (state = initialState, action) => {
  switch (action.type) {
    case `${BUY_COIN_ACTIONS.BUY_CRYPTO_GET_COIN_INFO}_SUCCESS`:
      if (action.isGetBasePrice) {
        return {
          ...state,
          basePrice: {
            ...state.basePrice,
            [action.currencyId]: {
              amount: action.amount,
              currencyId: action.currencyId,
              fiatCurrencyId: action.fiatCurrencyId,
              fiatLocalAmount: action.payload?.data?.fiat_local_amount,
              fiatAmountInUsd: action.payload?.data?.fiat_amount,
            },
          },
        };
      }
      return {
        ...state,
        coinInfo: { ...BuyCryptoCoinModel.parseCoinInfo(action?.payload?.data) },
      };
    case `${BUY_COIN_ACTIONS.BUY_CRYPTO_GET_BANK_INFO}_SUCCESS`:
      return {
        ...state,
        bankInfo: {
          ...state.bankInfo,
          [action?.payload?.data[0]?.country]: { ...action?.payload?.data[0]?.information },
        },
      };
    case `${BUY_COIN_ACTIONS.BUY_CRYPTO_ORDER}_SUCCESS`:
      return {
        ...state,
        order: { ...BuyCryptoCoinModel.parseOrder(action?.payload?.data) },
      };
    default:
      return state;
  }
};
export default buyCoinReducter;

