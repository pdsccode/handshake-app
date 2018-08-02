import axios from 'axios';
import { Wallet } from '@/services/Wallets/Wallet';
import configs from '@/configs';
import { StringHelper } from '@/services/helper';
import { TokenERC20 } from '@/services/Wallets/Tokens/TokenERC20';

const Web3 = require('web3');
const EthereumTx = require('ethereumjs-tx');
const hdkey = require('hdkey');
const ethUtil = require('ethereumjs-util');
const bip39 = require('bip39');

const BN = Web3.utils.BN;
const compiled = require('@/contracts/DogAndCat.json');
var erc20Abi = compiled.abi;
var contract_dogcat_addr ="0xcb58984487fc20b029c85d77f7b31b2d10333851"


export class DogAndCatDAD extends TokenERC20 {

    constructor() {
      super();      
      this.name = 'DCDAD';
      this.title = 'Dog & Cat DAD'; //Restaurant DAD
      this.className = 'DogAndCatDAD';
      this.customToken = false; // autonomous add.      
    }
    async getBalance(){
      const web3 = this.getWeb3();      
      let contract = new web3.eth.Contract(   
        erc20Abi,     
        configs.network[this.chainId].dogandcatTokenAddress, 
      );
      
      let balance = await contract.methods.balanceOf(this.address).call();                
      return Web3.utils.fromWei(balance.toString());

    }

    async transfer(toAddress, amountToSend){
      this.contractAddress = configs.network[this.chainId].shurikenTokenAddress;
      return super.transfer(toAddress, amountToSend);
    }
    
}

export default { DogAndCatDAD };
