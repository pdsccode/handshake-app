import axios from 'axios';
import satoshi from 'satoshi-bitcoin';
import { StringHelper } from '@/services/helper';
import { NB_BLOCKS } from '@/constants';
import { Bitcoin } from '@/services/Wallets/Bitcoin';

const BigNumber = require('bignumber.js');
const moment = require('moment');

const bitcore = require('bitcore-lib-cash');
const Mnemonic = require('bitcore-mnemonic');

export class BitcoinCashTestnet extends Bitcoin {
  static Network = { Testnet: 'https://test-bch-insight.bitpay.com/api' }

  constructor() {
    super();

    this.coinType = 1;
    this.name = 'BCH';
    this.title = 'BitcoinCash Testnet';
    this.className = 'BitcoinCashTestnet';
  }

  getShortAddress() {
    return this.address.replace(this.address.substr(4, 34), '...');
  }

  setDefaultNetwork() {
    bitcore.Networks.defaultNetwork = bitcore.Networks.testnet;
  }  
  createAddressPrivatekey() {
    super.createAddressPrivatekey();
    this.setDefaultNetwork();    
    // get Cashaddr
    var address = new bitcore.PrivateKey(this.privateKey).toAddress();
    this.address = address.toString().split(':')[1];
  }
  async getBalance() {
    this.setDefaultNetwork();

    const url = `${this.network}/addr/${this.address}/balance`;    
    const response = await axios.get(url);

    if (response.status == 200) {
      return await new BigNumber(response.data);
    }
    return false;
  }
}

export default { BitcoinCashTestnet };
