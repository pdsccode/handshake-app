import { APP } from '@/constants';
import WalletAction from '@/services/blockchain/wallet';
// import WalletModel from '@/models/Wallet';
import local from '@/services/localStore';
import { ACTIONS, createWalletAction } from './action';


const walletMasterMnemonic = WalletAction.masterMnemonic();
const walletRewardMnemonic = WalletAction.rewardMnemonic();

let wallets = local.get(APP.WALLET_LIST);

function walletsPowerful(walletsP) {
  const powerful = {};
  powerful.rewardList = walletsP.filter(wallet => wallet.isReward);
  powerful.mainnetList = walletsP.filter(wallet => !wallet.isTest);
  powerful.testnetList = walletsP.filter(wallet => wallet.isTest);
  return powerful;
}

if (!wallets) {
  wallets = [];
} else {
  wallets.forEach(wallet => createWalletAction(wallet));
}

const walletReducter = (state = {
  walletMasterMnemonic,
  walletRewardMnemonic,
  wallets,
  powerful: walletsPowerful(wallets),
  updatedAt: Date.now(),
}, action) => {
  switch (action.type) {
    case `${ACTIONS.FIRST_CREATE}_SUCCESS`:
      return {
        ...state,
        wallets: action.payload,
        updatedAt: Date.now(),
      };
    default:
      return state;
  }
};

export default walletReducter;
