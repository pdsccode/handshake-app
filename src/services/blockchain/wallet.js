import axios from 'axios';
import bip39 from 'bip39';
import hdkey from 'hdkey';
import BitcoreMnemonic from 'bitcore-mnemonic';
import satoshi from 'satoshi-bitcoin';
import EthUtil from 'ethereumjs-util';
import Tx from 'ethereumjs-tx';
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
      const BTCNetwork = this.isTest
        ? this.blockchain.connection.Networks.testnet
        : this.blockchain.connection.Networks.mainnet;
      this.wallet.address = this.blockchain.connection.Address(this.wallet.publicKey, BTCNetwork).toString();
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

  handshake(type) {
    const { contracts, contractFiles } = this.blockchain.connection.initObj;
    if (contracts) {
      const handshakeAddress = contracts[type];
      if (handshakeAddress) {
        this.currentHandshake = {
          address: contracts[type],
          type,
          file: contractFiles[type],
        };
      }
    }
    return this;
  }

  handshakeFile() {
    return require(`@/contracts/${this.currentHandshake.file}.json`); // eslint-disable-line
  }

  /* move to per handshake
  init(params) {
    if (this.isERC20) {
      this.makeRawTransaction({ offchain: 'unknown' });
    }
    return { status: 0, message: 'is not ETH' };
  }

  shake(params) {
    if (this.isERC20) {
      this.makeRawTransaction({ offchain: 'unknown' });
    }
    return { status: 0, message: 'is not ETH' };
  }

  async makeRawTransaction(params, successFn, errorFn) {
    const { connection } = this.blockchain;
    const { BN } = connection.utils;
    const nonce = await connection.eth.getTransactionCount(this.wallet.address);
    let amount;
    if (params.amount) {
      amount = connection.utils.toHex(connection.utils.toWei(String(params.amount, 'ether')));
    }

    let gasPrice = new BN(await connection.eth.getGasPrice());
    if (params.gasPrice) {
      gasPrice = new BN(connection.utils.toWei(String(gasPrice), 'gwei'));
    }

    const balance = new BN(await connection.eth.getBalance(this.wallet.address));
    const estimateGas = balance.div(gasPrice);
    const limitedGas = 3000000;
    const estimatedGas = Math.min(estimateGas, limitedGas);

    const rawTx = {
      nonce: connection.utils.toHex(nonce),
      gasPrice: connection.utils.toHex(gasPrice),
      gasLimit: limitedGas,
      data: params.payload,
      from: this.wallet.address,
      chainId: this.blockchain.connection.initObj.chainId,
      gas: estimatedGas,
      to: this.currentHandshake.address,
      value: amount,
    };

    const tx = new Tx(rawTx);
    tx.sign(Buffer.from(this.wallet.privateKey, 'hex'));
    const serializedTx = tx.serialize();
    const rawTxHex = `0x${serializedTx.toString('hex')}`;

    connection.eth.sendSignedTransaction(rawTxHex, (err, hash) => {
      if (err) {
        return errorFn({ e: err });
      }
      return successFn({
        hash,
        argumentsParams: params.argumentsParams,
        payload: params.payload,
      });
    });
  }
  */
}

export default Wallet;
