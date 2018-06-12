export const APP = {
  HEADER_DEFAULT: 'Handshake',
  // store
  VERSION: 'app_version',
  AUTH_TOKEN: 'auth_token',
  AUTH_PROFILE: 'auth_profile',
  WALLET_MASTER: 'wallet_master',
  WALLET_CACHE: 'wallet_cache',
  WALLET_DEFAULT: 'wallet_default',
  WALLET_LIST: 'wallet_list',
  IP_INFO: 'ip_info',
  EMAIL_NEED_VERIFY: 'email_need_verify',
};

export const HANDSHAKE_ID = { // important
  PROMISE: 1,
  EXCHANGE: 2,
  BETTING: 3,
  SEED: 4,
  WALLET_TRANSFER: 5,
};

export const HANDSHAKE_ID_DEFAULT = 3;

export const HANDSHAKE_NAME = {
  [HANDSHAKE_ID.BETTING]: 'Betting',
  [HANDSHAKE_ID.PROMISE]: 'Promise',
  // [HANDSHAKE_ID.EXCHANGE]: 'Exchange',
  // [HANDSHAKE_ID.SEED]: 'Seed',
  [HANDSHAKE_ID.WALLET_TRANSFER]: 'Transfer coin',
};

export const PRICE_DECIMAL = 0;
export const AMOUNT_DECIMAL = 6;

export const CRYPTO_CURRENCY = {
  ETH: 'ETH',
  BTC: 'BTC',
};

export const CRYPTO_CURRENCY_NAME = {
  [CRYPTO_CURRENCY.ETH]: 'ETH',
  [CRYPTO_CURRENCY.BTC]: 'BTC',
};

export const CRYPTO_CURRENCY_LIST = [
  { value: CRYPTO_CURRENCY.ETH, text: CRYPTO_CURRENCY_NAME[CRYPTO_CURRENCY.ETH] },
  { value: CRYPTO_CURRENCY.BTC, text: CRYPTO_CURRENCY_NAME[CRYPTO_CURRENCY.BTC] },
];
export const FIREBASE_PATH = {
  USERS: '/users',
};
export const CRYPTO_CURRENCY_DEFAULT = CRYPTO_CURRENCY.ETH;

export const EXCHANGE_ACTION = {
  BUY: 'buy',
  SELL: 'sell',
};

export const EXCHANGE_ACTION_NAME = {
  [EXCHANGE_ACTION.BUY]: 'Buy',
  [EXCHANGE_ACTION.SELL]: 'Sell',
};

export const EXCHANGE_ACTION_PAST_NAME = {
  [EXCHANGE_ACTION.BUY]: 'Bought',
  [EXCHANGE_ACTION.SELL]: 'Sold',
};

export const EXCHANGE_ACTION_PRESENT_NAME = {
  [EXCHANGE_ACTION.BUY]: 'Buying',
  [EXCHANGE_ACTION.SELL]: 'Selling',
};

export const EXCHANGE_ACTION_PERSON = {
  [EXCHANGE_ACTION.BUY]: 'buyer',
  [EXCHANGE_ACTION.SELL]: 'seller',
};

export const EXCHANGE_ACTION_LIST = [
  { value: EXCHANGE_ACTION.BUY, text: EXCHANGE_ACTION_NAME[EXCHANGE_ACTION.BUY] },
  { value: EXCHANGE_ACTION.SELL, text: EXCHANGE_ACTION_NAME[EXCHANGE_ACTION.SELL] },
];

export const EXCHANGE_ACTION_DEFAULT = EXCHANGE_ACTION.BUY;

export const FIAT_CURRENCY = 'USD';
export const FIAT_CURRENCY_SYMBOL = '$';

export const SELL_PRICE_TYPE_DEFAULT = 'fix';

// path
export const API_URL = {
  CRYPTOSIGN: {
    INIT_HANDSHAKE: 'cryptosign/handshake/init',
    SHAKE: 'cryptosign/handshake/shake',
    LOAD_MATCHES: 'cryptosign/match',
    LOAD_HANDSHAKES: 'cryptosign/handshake',
    CHECK_FREE_AVAILABLE: 'cryptosign/checkfree',
    UNINIT_HANDSHAKE: 'cryptosign/handshake/uninit',
    COLLECT: 'cryptosign/handshake/collect',
    ROLLBACK: 'cryptosign/handshake/rollback',
    REFUND: 'cryptosign/handshake/refund',
  },
  DISCOVER: {
    INDEX: 'handshake/discover',
  },
  EXCHANGE: {
    GET_CRYPTO_PRICE: 'exchange/info/instant-buy/price', // {path: '/info/instant-buy/price', method: 'get'},
    CREATE_CC_ORDER: 'exchange/instant-buys', // {path: '/instant-buys', method: 'post'},
    GET_USER_CC_LIMIT: 'exchange/user/profile/cc-limit', // {path: '/user/profile/cc-limit', method: 'get'},
    GET_CC_LIMITS: 'exchange/info/cc-limits', // {path: '/info/cc-limits', method: 'get'},
    GET_USER_PROFILE: 'exchange/user/profile', // {path: '/user/profile', method: 'get'},
    GET_OFFER_PRICE: 'exchange/info/crypto-quote', // {path: '/info/instant-buy/price', method: 'get'},
    GET_LIST_OFFER_PRICE: 'exchange/info/crypto-quotes', // {path: '/info/instant-buy/price', method: 'get'},
    GET_USER_TRANSACTION: 'exchange/user/transactions', // {path: '/user/transactions', method: 'get'},
    OFFERS: 'exchange/offers',
    SHAKE: 'shake',
    WITHDRAW: 'withdraw',
    IP_DOMAIN: 'https://ipfind.co/me',
  },
  SEED: {
    BASE: 'seed',
  },
  ME: {
    BASE: 'handshake/me',
  },
  HANDSHAKE: {
    INDEX: 'handshake', // id handshake
    CREATE: 'handshake/create',
    UPDATE: 'handshake/update',
    DELETE: 'handshake/delete',
  },
  COMMENT: {
    CREATE: 'comment/',
    LIST: 'comment/list',
    GET_COMMENT_COUNT: 'comment/count',
  },
};

export const HANDSHAKE_STATUS = {
  INITED: 0,
  SHAKED: 1,
  ACCEPTED: 2,
  REJECTED: 3,
  DONE: 4,
  CANCELLED: 5,
  PENDING: -1,
  TRANSACTION_FAILED: -2,
  NEW: -3,
  BLOCKCHAIN_PENDING: -4,
};

export const HANDSHAKE_STATUS_NAME = {
  [HANDSHAKE_STATUS.INITED]: 'Inited',
  [HANDSHAKE_STATUS.SHAKED]: 'Shaked',
  [HANDSHAKE_STATUS.ACCEPTED]: 'Accepted',
  [HANDSHAKE_STATUS.DONE]: 'Done',
  [HANDSHAKE_STATUS.CANCELLED]: 'Cancelled',
  [HANDSHAKE_STATUS.PENDING]: 'Pending',
  [HANDSHAKE_STATUS.TRANSACTION_FAILED]: 'Transaction Failed',
  [HANDSHAKE_STATUS.NEW]: 'New',
  [HANDSHAKE_STATUS.BLOCKCHAIN_PENDING]: 'Blockchain Pending',
};

export const HANDSHAKE_EXCHANGE_STATUS = {
  CREATED: 0,
  ACTIVE: 1,
  CLOSING: 2,
  CLOSED: 3,
  SHAKING: 4,
  SHAKE: 5,
  COMPLETING: 6,
  COMPLETED: 7,
  WITHDRAWING: 8,
  WITHDRAW: 9,
  REJECTING: 10,
  REJECTED: 11,
};

export const HANDSHAKE_EXCHANGE_STATUS_NAME = {
  [HANDSHAKE_EXCHANGE_STATUS.CREATED]: 'created',
  [HANDSHAKE_EXCHANGE_STATUS.ACTIVE]: 'active',
  [HANDSHAKE_EXCHANGE_STATUS.CLOSING]: 'closing',
  [HANDSHAKE_EXCHANGE_STATUS.CLOSED]: 'closed',
  [HANDSHAKE_EXCHANGE_STATUS.SHAKING]: 'shaking',
  [HANDSHAKE_EXCHANGE_STATUS.SHAKE]: 'shake',
  [HANDSHAKE_EXCHANGE_STATUS.COMPLETING]: 'completing',
  [HANDSHAKE_EXCHANGE_STATUS.COMPLETED]: 'completed',
  [HANDSHAKE_EXCHANGE_STATUS.WITHDRAWING]: 'withdrawing',
  [HANDSHAKE_EXCHANGE_STATUS.WITHDRAW]: 'withdraw',
  [HANDSHAKE_EXCHANGE_STATUS.REJECTING]: 'rejecting',
  [HANDSHAKE_EXCHANGE_STATUS.REJECTED]: 'rejected',
};

export const HANDSHAKE_EXCHANGE_STATUS_VALUE = {
  created: HANDSHAKE_EXCHANGE_STATUS.CREATED,
  active: HANDSHAKE_EXCHANGE_STATUS.ACTIVE,
  closing: HANDSHAKE_EXCHANGE_STATUS.CLOSING,
  closed: HANDSHAKE_EXCHANGE_STATUS.CLOSED,
  shaking: HANDSHAKE_EXCHANGE_STATUS.SHAKING,
  shake: HANDSHAKE_EXCHANGE_STATUS.SHAKE,
  completing: HANDSHAKE_EXCHANGE_STATUS.COMPLETING,
  completed: HANDSHAKE_EXCHANGE_STATUS.COMPLETED,
  withdrawing: HANDSHAKE_EXCHANGE_STATUS.WITHDRAWING,
  withdraw: HANDSHAKE_EXCHANGE_STATUS.WITHDRAW,
  rejecting: HANDSHAKE_EXCHANGE_STATUS.REJECTING,
  rejected: HANDSHAKE_EXCHANGE_STATUS.REJECTED,
};

export const HANDSHAKE_EXCHANGE_CC_STATUS = {
  PROCESSING: 0,
  SUCCESS: 1,
  CANCELLED: 2,
};

export const HANDSHAKE_EXCHANGE_CC_STATUS_NAME = {
  [HANDSHAKE_EXCHANGE_CC_STATUS.PROCESSING]: 'processing',
  [HANDSHAKE_EXCHANGE_CC_STATUS.SUCCESS]: 'success',
  [HANDSHAKE_EXCHANGE_CC_STATUS.CANCELLED]: 'cancelled',
};

export const HANDSHAKE_EXCHANGE_CC_STATUS_VALUE = {
  processing: HANDSHAKE_EXCHANGE_CC_STATUS.PROCESSING,
  success: HANDSHAKE_EXCHANGE_CC_STATUS.SUCCESS,
  cancelled: HANDSHAKE_EXCHANGE_CC_STATUS.CANCELLED,
};

export const HANDSHAKE_USER = {
  NORMAL: 0,
  OWNER: 1,
  SHAKED: 2,
};

export const HANSHAKE_USER_NAME = {
  [HANDSHAKE_USER.NORMAL]: 'NORMAL',
  [HANDSHAKE_USER.OWNER]: 'OWNER',
  [HANDSHAKE_USER.SHAKED]: 'SHAKED',
};

export const DEFAULT_FEE = {
  ETH: 0,
  BTC: 0,
};

export const EXCHANGE_FEED_TYPE = {
  EXCHANGE: 'exchange',
  INSTANT: 'instant',
};

export const EXCHANGE_METHOD_PAYMENT = {
  [EXCHANGE_FEED_TYPE.EXCHANGE]: 'cash',
  [EXCHANGE_FEED_TYPE.INSTANT]: 'credit card',
};

export const DISCOVER_GET_HANDSHAKE_RADIUS = 20;

export const APP_USER_NAME = 'Ninja';

export const MIN_AMOUNT = {
  [CRYPTO_CURRENCY.ETH]: 0.1,
  [CRYPTO_CURRENCY.BTC]: 0.01,
};


// API

export const BASE_API = {
  BASE_URL: process.env.BASE_API_URL,
  TIMEOUT: 10000,
};

export const URL = {
  INDEX: '/',

  HANDSHAKE_ME: '/me',
  HANDSHAKE_ME_INDEX: '/me',
  HANDSHAKE_ME_PROFILE: '/me/profile',
  HANDSHAKE_ME_VERIRY_EMAIL: '/me/verify/email',

  HANDSHAKE_DISCOVER: '/discover',
  HANDSHAKE_DISCOVER_INDEX: '/discover',
  HANDSHAKE_DISCOVER_DETAIL: '/discover/:slug',

  HANDSHAKE_CHAT: '/chat',
  HANDSHAKE_CHAT_INDEX: '/chat',
  HANDSHAKE_CHAT_DETAIL: '/chat/:username',

  HANDSHAKE_WALLET: '/wallet',
  HANDSHAKE_WALLET_INDEX: '/wallet',

  HANDSHAKE_CREATE: '/create',
  HANDSHAKE_CREATE_INDEX: '/create',

  HANDSHAKE_EXCHANGE: '/exchange',
  HANDSHAKE_EXCHANGE_INDEX: '/exchange',

  TRANSACTION_LIST: '/transactions',
  TRANSACTION_LIST_INDEX: '/transactions',

  COMMENTS_BY_SHAKE: '/comments',
  COMMENTS_BY_SHAKE_INDEX: '/comments',

  LANDING_PAGE_SHURIKEN: '/shuriken',
  LANDING_PAGE_SHURIKEN_INDEX: '/shuriken',

  LANDING_PAGE_TRADE: '/coin-exchange',
  LANDING_PAGE_TRADE_INDEX: '/coin-exchange',

  FAQ: '/faq',
  FAQ_INDEX: '/faq',
};

