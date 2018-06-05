export const BASE_API = {
  BASE_URL: process.env.BASE_URL,
  TIMEOUT: 10000,
};

export const URL = {
  INDEX: '/',

  HANDSHAKE_ME: '/me',
  HANDSHAKE_ME_INDEX: '/me',
  HANDSHAKE_ME_PROFILE: '/me/profile',

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

  COMMENTS_BY_SHAKE: '/comments',
  COMMENTS_BY_SHAKE_INDEX: '/comments',
};

export const firebase = {
  apiKey: 'AIzaSyAY_QJ_6ZmuYfNR_oM65a0JVvzIyMb-n9Q',
  authDomain: 'handshake-205007.firebaseapp.com',
  databaseURL: 'https://handshake-205007.firebaseio.com',
  projectId: 'handshake-205007',
  storageBucket: 'handshake-205007.appspot.com',
  messagingSenderId: '852789708485',
};
