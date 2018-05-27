// import { BASE_API } from '@/config';
import { createAPI } from '@/reducers/action';

export const EXCHANGE_ACTIONS = {
  GET_CRYPTO_PRICE: 'GET_CRYPTO_PRICE',

  CREATE_CC_ORDER: 'CREATE_CC_ORDER',

  GET_USER_CC_LIMIT: 'GET_USER_CC_LIMIT',

  GET_CC_LIMITS: 'GET_CC_LIMITS',

  GET_USER_PROFILE: 'GET_USER_PROFILE',

  GET_USER_TRANSACTION: 'GET_USER_TRANSACTION',

  CREATE_OFFER: 'CREATE_OFFER',
  CLOSE_OFFER: 'CLOSE_OFFER',
  SHAKE_OFFER: 'SHAKE_OFFER',
  COMPLETE_SHAKE_OFFER: 'COMPLETE_SHAKE_OFFER',
  CANCEL_SHAKE_OFFER: 'CANCEL_SHAKE_OFFER'
};

export const getCryptoPrice = createAPI({
  INIT: EXCHANGE_ACTIONS.GET_CRYPTO_PRICE,
});

export const createCCOrder = createAPI({
  INIT: EXCHANGE_ACTIONS.CREATE_CC_ORDER,
});

export const getUserCcLimit = createAPI({
  INIT: EXCHANGE_ACTIONS.GET_USER_CC_LIMIT,
});

export const getCcLimits = createAPI({
  INIT: EXCHANGE_ACTIONS.GET_CC_LIMITS,
});

export const getUserProfile = createAPI({
  INIT: EXCHANGE_ACTIONS.GET_USER_PROFILE,
});

export const getUserTransaction = createAPI({
  INIT: EXCHANGE_ACTIONS.GET_USER_TRANSACTION,
});

export const createOffer = createAPI({
  INIT: EXCHANGE_ACTIONS.CREATE_OFFER,
});

export const closeOffer = createAPI({
  INIT: EXCHANGE_ACTIONS.CREATE_OFFER,
});

export const shakeOffer = createAPI({
  INIT: EXCHANGE_ACTIONS.SHAKE_OFFER,
});

export const completeShakeOffer = createAPI({
  INIT: EXCHANGE_ACTIONS.COMPLETE_SHAKE_OFFER,
});

export const cancelShakeOffer = createAPI({
  INIT: EXCHANGE_ACTIONS.CANCEL_SHAKE_OFFER,
});



