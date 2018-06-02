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
  HANDSHAKE_DISCOVER_DETAIL: '/discover/:id',

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

export const firebase = {
  apiKey: 'AIzaSyAY_QJ_6ZmuYfNR_oM65a0JVvzIyMb-n9Q',
  authDomain: 'handshake-205007.firebaseapp.com',
  databaseURL: 'https://handshake-205007.firebaseio.com',
  projectId: 'handshake-205007',
  storageBucket: 'handshake-205007.appspot.com',
  messagingSenderId: '852789708485',
};

export const blockchainNetworks = {
  rinkeby: {
    type: 'ERC20',
    endpoint: 'https://rinkeby.infura.io/',
    name: 'Rinkeby',
    isTest: true,
    unit: 'ETH',
    chainId: 4,
    contracts: {
      basic: '0x4c621cfd5496b2077eb1c5b0308e2ea72358191b',
      prediction: '0x8b4d252a89ae56af24fd9557e803e81b42b66929',
      exchange: '0xdb42bfb35f4bbc402ede625ff1f3717336fac1ab',
    },
  },
  ethereum: {
    type:
    'ERC20',
    endpoint: 'https://mainnet.infura.io/',
    name: 'Ethereum',
    unit: 'ETH',
    chainId: 1,
    contracts: {
      basic: '',
      prediction: '',
      exchange: '',
    },
  },
  bitcoin: {
    type: 'BTC',
    endpoint: 'https://insight.bitpay.com/api',
    name: 'Bitcoin',
    unit: 'BTC',
  },
  bitcoinTest: {
    type: 'BTC',
    endpoint: 'https://test-insight.bitpay.com/api',
    name: 'Bitcoin Test',
    isTest: true,
    unit: 'BTC',
  },
};
