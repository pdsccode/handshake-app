import { createAPI } from '@/reducers/action';

export const BUY_COIN_ACTIONS = {
  BUY_CRYPTO_COD: 'BUY_CRYPTO_COD',
  BUY_CRYPTO_GET_COIN_INFO: 'BUY_CRYPTO_GET_COIN_INFO',
};

export const buyCryptoGetCoinInfo = createAPI(BUY_COIN_ACTIONS.BUY_CRYPTO_GET_COIN_INFO);
export const buyCryptoCod = createAPI(BUY_COIN_ACTIONS.BUY_CRYPTO_COD);

