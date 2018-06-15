import axios from 'axios';
import { Wallet } from '@/models/Wallet.js';
import configs from '@/configs';
import { StringHelper } from '@/services/helper';

const Web3 = require('web3');
const EthereumTx = require('ethereumjs-tx');
const hdkey = require('hdkey');
const ethUtil = require('ethereumjs-util');
const bip39 = require('bip39');
const BN = Web3.utils.BN;

export class Shuriken extends Ethereum {

    constructor() {
      super();
      this.coinType = 60;
      this.name = 'SHURI';
      this.title = 'Shuriken';
      this.className = 'Shuriken';
    }
}



export default { Ethereum };
