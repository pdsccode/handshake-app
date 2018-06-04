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
  powerful.mainnetList = walletsP.filter(wallet => !wallet.isTest && !wallet.isReward);
  powerful.testnetList = walletsP.filter(wallet => wallet.isTest && !wallet.isReward);
  powerful.defaultWallets = walletsP.filter(wallet => wallet.isDefault);
  powerful.defaultWallet = (type) => {
    switch (type) {
      case 'BTC':
        return powerful.defaultWallets.filter(wallet => wallet.type === 'BTC')[0];
      case 'ETH':
        return powerful.defaultWallets.filter(wallet => wallet.type === 'ERC20')[0];
      default:
        break;
    }
    return false;
  };
  powerful.rewardWallet = (type) => {
    switch (type) {
      case 'BTC':
        return powerful.rewardList.filter(wallet => wallet.type === 'BTC')[0];
      case 'ETH':
        return powerful.rewardList.filter(wallet => wallet.type === 'ERC20')[0];
      default:
        break;
    }
    return false;
  };
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
        powerful: walletsPowerful(action.payload),
      };
    default:
      return state;
  }
};

export default walletReducter;
