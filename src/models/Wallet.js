import { blockchainNetworks as blockchains } from '@/config';

class Wallet {
  static wallet(data) {
    const newWallet = {
      networkKey: data.networkKey || '',
      endpoint: data.endpoint || '',
      mnemonic: data.mnemonic || '',
      isTest: data.isTest || false,
      type: data.type || '',
      name: data.name || '',
      unit: data.unit || '',
      privateKey: data.privateKey || '',
      publicKey: data.publicKey || '',
      address: data.address || '',
      isDefault: data.isDefault || false,
      isProtected: data.isProtected || false,
      isReward: data.isReward || false,
    };

    if (newWallet.networkKey) {
      newWallet.endpoint = blockchains[newWallet.networkKey].endpoint;
      newWallet.type = blockchains[newWallet.networkKey].type;
      newWallet.name = blockchains[newWallet.networkKey].name;
      newWallet.unit = blockchains[newWallet.networkKey].unit;
      newWallet.isTest = blockchains[newWallet.networkKey].isTest;
    }

    return newWallet;
  }
}

export default Wallet;
