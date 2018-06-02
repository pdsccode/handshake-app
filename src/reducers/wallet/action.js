import local from '@/services/localStore';
import WalletModel from '@/models/Wallet';
import Blockchain from '@/services/blockchain';
import Helper from '@/services/helper';
import WalletAction from '@/services/blockchain/wallet';
import { APP } from '@/constants';


const walletMasterMnemonic = WalletAction.masterMnemonic();
const walletRewardMnemonic = WalletAction.rewardMnemonic();

export const ACTIONS = {
  FIRST_CREATE: 'FIRST_CREATE',
};

export const createWalletAction = (wallet) => {
  let connection = '';
  if (wallet.networkKey) {
    connection = Helper.Wallet.createBlockchainConnect(wallet.networkKey);
  } else {
    connection = new Blockchain(wallet.type)
      .connect(wallet.endpoint)
      .setName(wallet.name)
      .setUnit(wallet.unit)
      .setTest(wallet.isTest);
  }
  const action = new WalletAction(connection, wallet.mnemonic, wallet.privateKey);
  const walletData = wallet;
  walletData.action = action;

  walletData.privateKey = action.wallet.privateKey;
  walletData.publicKey = action.wallet.publicKey;
  walletData.address = action.wallet.address;

  return walletData;
};

const createWalletMasters = () => {
  let wallets = [
    createWalletAction(WalletModel.wallet({
      networkKey: 'rinkeby',
      mnemonic: walletMasterMnemonic,
      isDefault: true,
    })),
    createWalletAction(WalletModel.wallet({
      networkKey: 'rinkeby',
      mnemonic: walletRewardMnemonic,
      isReward: true,
    })),
    createWalletAction(WalletModel.wallet({
      networkKey: 'bitcoinTest',
      mnemonic: walletMasterMnemonic,
      isDefault: true,
    })),
    createWalletAction(WalletModel.wallet({
      networkKey: 'bitcoinTest',
      mnemonic: walletRewardMnemonic,
      isReward: true,
    })),
  ];

  wallets = wallets.map(wallet => WalletModel.wallet(wallet));
  local.save(APP.WALLET_LIST, wallets);

  return wallets;
};

export const createWallets = () => (dispatch) => {
  dispatch({ type: ACTIONS.FIRST_CREATE });
  return new Promise((resolve) => {
    const wallets = createWalletMasters();
    resolve(wallets);
  });
};

export const createWwalletsSucess = data => ({ type: `${ACTIONS.FIRST_CREATE}_SUCCESS`, payload: data });
