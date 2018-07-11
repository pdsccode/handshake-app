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

  setDefaultNetwork() {
    bitcore.Networks.defaultNetwork = bitcore.Networks.testnet;
  }  
  createAddressPrivatekey() {
    super.createAddressPrivatekey();
    this.setDefaultNetwork();    
    var address = new bitcore.PrivateKey(this.privateKey).toAddress();
    this.address = address.toString();
  }
}

export default { BitcoinCashTestnet };
