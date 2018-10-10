/* eslint camelcase:0 */

import BuyCryptoCoinInfoModel from '@/models/BuyCryptoCoinInfo';
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
        coinInfo: { ...BuyCryptoCoinInfoModel.parseRes(action?.payload?.data) },
      };
    case `${BUY_COIN_ACTIONS.BUY_CRYPTO_GET_BANK_INFO}_SUCCESS`:
      return {
        ...state,
        bankInfo: { ...action?.payload?.data[0] },
      };
    default:
      return state;
  }
};
export default buyCoinReducter;

