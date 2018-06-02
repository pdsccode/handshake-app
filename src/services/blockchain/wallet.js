import axios from 'axios';
import bip39 from 'bip39';
import hdkey from 'hdkey';
import BitcoreMnemonic from 'bitcore-mnemonic';
import satoshi from 'satoshi-bitcoin';
import EthUtil from 'ethereumjs-util';
import local from '@/services/localStore';
import { APP } from '@/constants';

class Wallet {
  // mnemonic
  static randomMnemonic() {
    return bip39.generateMnemonic();
  }

  static getMnemonic(key) {
    let mnemonic = local.get(key);
    if (!mnemonic) {
      mnemonic = Wallet.randomMnemonic();
      local.save(key, mnemonic);
      return mnemonic;
    }
    return mnemonic;
  }

  static masterMnemonic() {
    return Wallet.getMnemonic(APP.WALLET_MASTER);
  }

  static rewardMnemonic() {
    return Wallet.getMnemonic(APP.WALLET_REWARD);
  }

  // wallet default
  static getDefaultAppKei() {
    return local.get(APP.WALLET_DEFAULT);
  }

  static getDefault() {
    const appKei = Wallet.getDefaultAppKei();
    return local.get(APP.WALLET_CACHE)[appKei];
  }

  static makeDefault(appKei) {
    local.save(APP.WALLET_DEFAULT, appKei);
  }

  // wallet cache
  static getWalletCache() {
    return local.get(APP.WALLET_CACHE) || {};
  }

  static saveWalletCache(data) {
    return local.save(APP.WALLET_CACHE, data || {});
  }

  static clearWalletCache() {
    return Wallet.saveWalletCache({});
  }

  constructor(blockchain, mnemonic, initPrivateKey) {
    this.blockchain = blockchain;
    this.isTest = blockchain.isTest;

    this.mnemonic = mnemonic;
    this.initPrivateKey = initPrivateKey;

    this.isBTC = blockchain.isBTC;
    this.isERC20 = blockchain.isERC20;

    this.walletCache = Wallet.getWalletCache();

    // check exist cache
    const currentWalletCache = this.walletCache[this.getAppKei()];
    if (currentWalletCache) {
      this.wallet = currentWalletCache;
      return this;
    }

    return this.createWalletCache();
  }

  createWalletCache() {
    this.wallet = {};

    // Mnemonic
    if (this.mnemonic) {
      const code = new BitcoreMnemonic(this.mnemonic);

      if (this.isERC20) {
        const root = hdkey.fromMasterSeed(code.toSeed());
        const addrNode = root.derive(('m/44\'/60\'/0\'/0/0'));
        this.wallet.privateKey = addrNode.privateKey;
      }

      if (this.isBTC) {
        const xpriv1 = code.toHDPrivateKey();
        const hdPrivateKey = new this.blockchain.connection.HDPrivateKey(xpriv1);
        this.wallet.privateKey = hdPrivateKey.xprivkey;
        this.wallet.publicKey = hdPrivateKey.hdPublicKey.publicKey;
      }
    }

    // Private key
    if (!this.wallet.privateKey && this.initPrivateKey) {
      this.wallet.privateKey = this.initPrivateKey;
    }

    if (this.isERC20) {
      const publicKey = EthUtil.privateToPublic(this.wallet.privateKey);
      this.wallet.address = EthUtil.toChecksumAddress(EthUtil.publicToAddress(publicKey).toString('hex'));
      this.wallet.publicKey = publicKey.toString('hex');
      this.wallet.privateKey = this.wallet.privateKey.toString('hex');
    }

    if (this.isBTC) {
      this.wallet.address = this.blockchain.connection.Address(this.wallet.publicKey, this.isTest ? this.blockchain.connection.Networks.testnet : this.blockchain.connection.Networks.mainnet).toString();
      this.wallet.publicKey = this.wallet.publicKey.toString('hex');
    }

    this.walletCache[this.getAppKei()] = this.wallet;
    Wallet.saveWalletCache(this.walletCache);

    return this;
  }

  getAppKei() {
    if (this.mnemonic) {
      return `${this.blockchain.network}|mnemonic|${this.mnemonic}`;
    }
    if (this.initPrivateKey) {
      return `${this.blockchain.network}|privatekey|${this.initPrivateKey}`;
    }
    return false;
  }

  getAppKed() {
    return `${this.wallet.address}@${this.blockchain.network}`;
  }

  setProtected() {
    this.walletCache = Wallet.getWalletCache();
    this.walletCache(this.getAppKei).isProtected = true;
    Wallet.saveWalletCache(this.walletCache);
  }

  async getBalance() {
    if (this.blockchain.isERC20) {
      const balance = await this.blockchain.connection.eth.getBalance(this.wallet.address);
      return this.blockchain.connection.utils.fromWei(balance.toString());
    }
    if (this.blockchain.isBTC) {
      const url = `${this.blockchain.network}/addr/${this.wallet.address}/balance`;
      const response = await axios.get(url);
      if (response.status === 200) {
        const balance = await satoshi.toBitcoin(response.data);
        return balance;
      }
    }
    return false;
  }

  getShortAddress() {
    if (this.blockchain.isERC20) {
      return this.wallet.address.replace(this.wallet.address.substr(5, 31), '...');
    }

    if (this.blockchain.isBTC) {
      return this.wallet.address.replace(this.wallet.address.substr(5, 23), '...');
    }
    return '';
  }
}

export default Wallet;
