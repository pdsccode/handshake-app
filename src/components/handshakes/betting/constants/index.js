export const MESSAGE_SERVER = {
  /* ERROR */
  1000: 'Please double check your input data.',
  1001: 'No equivalent bets found. Please create a new bet.',
  1002: 'Please provide valid wallet address!',
  1003: 'Missing offchain data!',
  1004: 'Odds should be large than 1',
  1005: 'The maximum free bet is 100!',
  1006: 'You cannot withdraw this handshake!',
  1007: 'Cannot rollback this handshake!',

  /* OUTCOME */
  1008: 'Please check your outcome id',
  1009: 'Please check your outcome result',
  1010: 'This outcome has had result already!',

  /* MATCH */
  1011: 'Match not found. Please try again.',
  1012: 'Match result invalid. Please try again.',
  1013: 'Match result is empty. Please try again.',
  1014: 'The report time is exceed!',

  /* USER */
  1015: 'Please enter a valid email address.',
  1016: 'Please make sure your email and password are correct.',
  1017: 'Sorry, we were unable to register you. Please contact human@autonomous.ai for support.',
  1018: 'Invalid user',
  1019: 'Please purchase to sign more.',
  1020: 'Invalid user',
  1021: 'Please login with google+ or facebook account.',
  1022: 'You have received free bet already!',

  /* HANSHAKE */
  1023: 'You\'re out of gas! Please wait while we add ETH to your account.',
  1024: 'You can\'t Handshake with yourself!',
  1025: 'This Handshake seems to be empty.',
  1026: 'You are not authorized to make this Handshake.',
  1027: 'Contract file not found!',
  1028: 'Handshake not found. Please try again.',
  1029: 'Please enter a payment amount.',
  1030: 'Amount should be larger > 0.',
  1031: 'Amount key is invalid.',
  1032: 'Public key is invalid.',
  1033: 'Please enter a valid wallet address which exists in our system.',
  1034: 'You\'re out of gas! Please wait while we add ETH to your account.',
  1035: 'Your note is too long. It should be less than 1000 characters.',
  1036: 'Please choose type of handshake.',
  1037: 'This is not betting template.',
  1038: 'There is shakers. Therefore you cannot refund!',
  1039: 'Your result does not match with outcome!',
  1040: 'Withdraw only works after dispute time.',

  /* SHAKER */
  1041: 'Shaker not found. Please try again.',
  1042: 'You have rollbacked already!',


  /* WALLET */
  1043: 'Busy day for Handshakes - we\'re out of freebies! Please try again tomorrow.',
  1044: 'You can only request free Handshakes once.',
  1045: 'Your account can\'t get free ETH.',
};


export const MESSAGE = {
  BET_PROGRESSING: 'Your bet is creating. Please wait',
  CREATE_BET_NOT_MATCH: 'Finding a ninja to bet against you.',
  CREATE_BET_MATCHED: 'Bet matched! Waiting for outcome.',
  NOT_ENOUGH_BALANCE: 'Too rich for your blood. Please top up your wallet.',
  NOT_ENOUGH_GAS: `Not enough gas. Your balance should larger than 0.007eth gas + value. Please top up your wallet.`,
  CHOOSE_MATCH: 'Please choose match and outcome',
  ODD_LARGE_THAN: 'Please enter odds greater than 1',
  AMOUNT_VALID: 'Please place a bet larger than 0.',
  MATCH_OVER: 'Time travel is hard. Please bet on a future or ongoing match.',
  RIGHT_NETWORK: 'You must set your wallet on Mainnet',
  ROLLBACK: `Something did not go according to plan. Please try again.`,
  WITHDRAW_SUCCESS: 'Success! Your winnings have been withdrawn to your wallet.',
  DIFFERENCE_ADDRESS: `Current address isn't same as which you used to create bet`,
};


export const BET_BLOCKCHAIN_STATUS = {
  STATUS_INIT_FAILED: -10,
  STATUS_COLLECT_FAILED: -9,
  STATUS_COLLECT_PENDING: -8,
  STATUS_DISPUTE_FAILED: -7,
  STATUS_REFUND_FAILED: -6,
  STATUS_MAKER_UNINIT_FAILED: -5,
  STATUS_MAKER_UNINIT_PENDING: -4,

  STATUS_SHAKER_ROLLBACK: -3,
  STATUS_MAKER_INIT_ROLLBACK: -2,


  STATUS_PENDING: -1,
  STATUS_INITED: 0,
  STATUS_MAKER_UNINITED: 1,
  STATUS_SHAKER_SHAKED: 2,
  STATUS_REFUND: 3,
  STATUS_DISPUTE: 4,
  STATUS_RESOLVE: 5,
  STATUS_DONE: 6,
};

export const ROLE = {
  INITER: 1,
  SHAKER: 2,
};

export const SIDE = {
  SUPPORT: 1,
  AGAINST: 2,
};
export const BET_TYPE = {
  INIT: 'init',
  SHAKE: 'shake',
};
export const BETTING_STATUS = {
  INITED: -1,
  DRAW: 0,
  SUPPORT_WIN: 1,
  AGAINST_WIN: 2,
};

export const BETTING_STATUS_LABEL =
{
  INITING: 'Placing a bet..',
  CANCEL: 'Cancel this bet',
  RETRY: 'Retry',
  ROLLBACK_INIT: 'There is something wrong with blockchain. The bet is cancelled',
  ROLLBACK_SHAKE: 'There is something wrong with blockchain. The bet is cancelled',
  COLLECT_FAILED: 'There is something wrong with withdraw. Please cancel to get back money',
  ACTION_FAILED: `There is something wrong with blockchain. Your action is cancelled`,
  INIT_FAILED: `There is something wrong with blockchain. Your bet is cancelled`,
  SOLVE: 'Please retry to solve problem',
  LOSE: 'Better luck next time.',
  WIN: `You're a winner!`,
  WIN_WAIT: `<br/> It's not time to withdraw. Please wait..`,
  DONE: ` The bet is done.`,
  WITHDRAW: 'Withdraw winnings',
  CANCELLING: 'Your bet is being cancelled.',
  PROGRESSING: 'Your bet is progressing a transaction. Please wait..',
  BET_WAIT_MATCHING: 'Bet placed. Matching..',
  BET_MACHED_WAIT_RESULT: 'Bet matched. Waiting for result..',
  REFUND: 'Refund your bet',
  CANCELLED: 'Your bet was cancelled.',
  REFUNDING: 'Your coin is being refunded to you.',
  REFUNDED: 'Your coin has been refunded.',
  ROLLBACK: `Something did not go according to plan. We're fixing it`,

};

export const CONTRACT_METHOD = {
  INIT: 'init',
  SHAKE: 'shake',
  CANCEL: 'uninit',
  REFUND: 'refund',
  COLLECT: 'collect',
  CREATE_MARKET: 'createMarket',
};
