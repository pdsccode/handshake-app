import { StringHelper } from '@/utils/helper';

eximport { findKey } from '@firebase/util';
port class Wallet {
  constructor() {
    this.mnemonic = '';
    this.address = '';
    this.privateKey = '';
    this.coinType = '';
    this.default = false;
    this.balance = 0;
    this.network = '';
    this.name = '';
    this.title = '';
    this.protected = false;
    this.className = '';
    this.isReward = false;
    this.chainId = -1;
    this.isToken = false;
    this.customToken = false;
    this.isCollectibles = false;
    this.decimals = 18;
  }

  getShortAddress() {
    return this.address.replace(this.address.substr(4, 34), '...');
  }
  getNetwork() {
    return this.network;
  }
  getNetworkName() {
    const networkName = this.constructor.Network.find((network) => {
      if (network === this.network) {
        return true;
      }
      return false;
    });
    return networkName ? networkName : this.title;
  }
  getShortBalance() {
    return Number((parseFloat(this.balance)).toFixed(8));
  }
  getBackgroundImg() {
    return StringHelper.format('{0}-{1}{2}.svg', this.className.toLowerCase(), this.getNetworkName().toLowerCase(), this.isReward ? '-reward' : '');
  }
}

export default { Wallet };
