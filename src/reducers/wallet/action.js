import { unionBy } from 'lodash';
import Blockchain from '@/services/blockchain';
import Wallet from '@/services/wallet';
import local from '@/services/localStore';
import { APP } from '@/constants';
import { uuid } from '@/services/app';

const ethBlockchain = new Blockchain('ETH');
const btcBlockchain = new Blockchain('BTC');

// base
export function migrate() {
  const localWallets = local.get(APP.WALLET);
  if (localWallets) {
    const migrateWallets = localWallets.map((wallet) => {
      const clone = Object.assign({}, wallet);
      if (clone && !clone.id) {
        clone.id = uuid();
      }
      return clone;
    });
    local.save(APP.WALLET, migrateWallets);
  }
}

export function parseWallet(wallet) {
  let blockchain = ethBlockchain;
  if (wallet.name === 'BTC') blockchain = btcBlockchain;
  blockchain = blockchain.connect.connectTo(wallet.network);
  return new Wallet(wallet, blockchain);
}

export function unparseWallet(wallet) {
  return wallet.data;
}

export function updateWallets(wallets) {
  const localWallets = local.get(APP.WALLET);
  const nextUpdateWallets = wallets.map(wallet => unparseWallet(wallet));
  local.save(APP.WALLET, unionBy(nextUpdateWallets, localWallets, 'id'));
}

export function getDefaultWallet(wallets, networkName) {
  const networkWallets = wallets.filter(wallet => wallet.data.name === networkName);
  let networkDefaultWallets = networkWallets.filter(wallet => wallet.data.default === true);
  let defaultWallet = false;
  if (networkDefaultWallets.length === 0) {
    if (!networkWallets.length === 0) {
      [defaultWallet] = networkWallets;
      defaultWallet.data.default = true;
      networkWallets[0] = defaultWallet;
    }
  } else {
    [defaultWallet] = networkDefaultWallets;
    if (networkDefaultWallets.length > 1) {
      networkDefaultWallets = networkDefaultWallets.map((wallet, index) => {
        if (index === 0) return wallet;
        const clone = wallet;
        clone.data.default = false;
        return clone;
      });
    }
  }
  return defaultWallet;
}

export function parseTool(wallets) {
  return {
    default: {
      eth: getDefaultWallet(wallets, 'ETH'),
      btc: getDefaultWallet(wallets, 'BTC'),
    },
  };
}

// advances
