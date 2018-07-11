import axios from 'axios';
import satoshi from 'satoshi-bitcoin';
import { StringHelper } from '@/services/helper';
import { Wallet } from '@/services/Wallets/Wallet';
import { NB_BLOCKS } from '@/constants';

const bitcoreCash = require('bitcore-lib-cash');
const BigNumber = require('bignumber.js');
const moment = require('moment');

export class BitcoinCash extends Wallet {
  static Network = { Mainnet: 'https://bch-insight.bitpay.com/api' }

  constructor() {
    super();

    this.coinType = 0;
    this.name = 'BCH';
    this.title = 'BitcoinCash';
    this.className = 'BitcoinCash';
  }

  setDefaultNetwork() {
    bitcoreCash.Networks.defaultNetwork = bitcoreCash.Networks.testnet;
  }
  
}

export default { BitcoinCash };
