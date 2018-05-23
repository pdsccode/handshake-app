export const HANDSHAKE_API = {
  BASE_URL: process.env.BASE_URL,
  TIMEOUT: 10000,
  SIGN_IN: { path: 'sign-in/', method: 'post' },
  SOCIAL_SIGN_IN: { path: 'social-login/', method: 'post' },
  HANDSHAKE: {
    LOAD: { path: 'handshake', method: 'post' },
    INIT: { path: 'handshake/init', method: 'post' },
    SHAKE: { path: 'handshake/shake', method: 'post' },
    INDUSTRIES: { path: 'handshake/industries', method: 'post' },
  },
  EXCHANGE: {
    GET_CRYPTO_PRICE: {path: '/info/instant-buy/price', method: 'get'},
    CREATE_CC_ORDER: {path: '/instant-buys', method: 'post'},
    GET_USER_CC_LIMIT: {path: '/user/profile/cc-limit', method: 'get'},
    GET_CC_LIMITS: {path: '/info/cc-limits', method: 'get'},
    GET_USER_PROFILE: {path: '/user/profile/full', method: 'get'},
  }
};

// Client url
export const URL = {
  INDEX: '/',

  AUTH_SIGN_IN: '/auth/sign-in',
  AUTH_SIGN_UP: '/auth/sign-up',
  AUTH_SIGN_OUT: '/auth/sign-out',

  HANDSHAKE_ME: '/me',
  HANDSHAKE_ME_INDEX: '/me',

  HANDSHAKE_DISCOVER: '/discover',
  HANDSHAKE_DISCOVER_INDEX: '/discover',
  HANDSHAKE_DISCOVER_DETAIL: '/discover/:id',

  HANDSHAKE_CHAT: '/chat',
  HANDSHAKE_CHAT_INDEX: '/chat',

  HANDSHAKE_WALLET: '/wallet',
  HANDSHAKE_WALLET_INDEX: '/wallet',

  HANDSHAKE_CREATE: '/create',
  HANDSHAKE_CREATE_INDEX: '/create',

  HANDSHAKE_EXCHANGE: '/exchange',
  HANDSHAKE_EXCHANGE_INDEX: '/exchange',
};

export const HANDSHAKE_STATUS = {
  STATUS_BLOCKCHAIN_PENDING: -4,
  STATUS_NEW: -3,
  STATUS_TRANSACTION_FAILED: -2,
  STATUS_PENDING: -1,
  STATUS_INITED: 0,
  STATUS_SHAKED: 1,
  STATUS_ACCEPTED: 2,
  STATUS_REJECTED: 3,
  STATUS_DONE: 4,
  STATUS_CANCELLED: 5,
  TERM_NONE: 0,
  TERM_COD: 1,
  TERM_NET30: 2,
  TERM_VESTING: 3,
};
