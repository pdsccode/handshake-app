export const BASE_API = {
  BASE_URL: process.env.BASE_URL,
  TIMEOUT: 10000,
  EXCHANGE: {
    GET_CRYPTO_PRICE: {path: '/info/instant-buy/price', method: 'get'},
    CREATE_CC_ORDER: {path: '/instant-buys', method: 'post'},
    GET_USER_CC_LIMIT: {path: '/user/profile/cc-limit', method: 'get'},
    GET_CC_LIMITS: {path: '/info/cc-limits', method: 'get'},
    GET_USER_PROFILE: {path: '/user/profile', method: 'get'},
    GET_USER_TRANSACTION: {path: '/user/transactions', method: 'get'},
  }
};

export const URL = {
  INDEX: '/',

  HANDSHAKE_ME: '/me',
  HANDSHAKE_ME_INDEX: '/me',

  HANDSHAKE_DISCOVER: '/discover',
  HANDSHAKE_DISCOVER_INDEX: '/discover',
  HANDSHAKE_DISCOVER_DETAIL: '/discover/:slug',

  HANDSHAKE_CHAT: '/chat',
  HANDSHAKE_CHAT_INDEX: '/chat',

  HANDSHAKE_WALLET: '/wallet',
  HANDSHAKE_WALLET_INDEX: '/wallet',

  HANDSHAKE_CREATE: '/create',
  HANDSHAKE_CREATE_INDEX: '/create',

  HANDSHAKE_EXCHANGE: '/exchange',
  HANDSHAKE_EXCHANGE_INDEX: '/exchange',

  TRANSACTION_LIST: '/transactions',
  TRANSACTION_LIST_INDEX: '/transactions',
};
