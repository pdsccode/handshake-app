import axios from 'axios';
import { Wallet } from '@/models/Wallet.js';
import { StringHelper } from '@/services/helper';
import { Ethereum } from '@/models/Ethereum.js';
import { TokenERC721 } from '@/models/TokenERC721';

const Web3 = require('web3');
const BN = Web3.utils.BN;
const BigNumber = require('bignumber.js');

const EthereumTx = require('ethereumjs-tx');

const abi = require('@/contracts/CryptoKitties.json');

export class CryptoKitties extends TokenERC721 {

    constructor() {
      super();
      this.className = 'CryptoKitties';
      this.isToken = true;
      this.contractAddress = '0x06012c8cf97bead5deae237070f9587f8e7a266d';
      this.decimals = 0;
      this.customToken = true;
      this.title = "CryptoKitties";
      this.name = "CK";
    }  
}

export default { CryptoKitties };
