import axios from 'axios';
import { Wallet } from '@/models/Wallet.js';
import configs from '@/configs';

const Web3 = require('web3');
const EthereumTx = require('ethereumjs-tx');
const hdkey = require('hdkey');
const ethUtil = require('ethereumjs-util');
const bip39 = require('bip39');
const moment = require('moment');
const BN = Web3.utils.BN;

export class Ethereum extends Wallet {
    static Network = { Mainnet: 'https://mainnet.infura.io/', Rinkeby: 'https://rinkeby.infura.io/' }
    static API = { Mainnet: 'https://api-rinkeby.etherscan.io/api', Rinkeby: 'https://api-rinkeby.etherscan.io/api' }

    constructor() {
      super();
      this.coinType = 60;
      this.name = 'ETH';
      this.title = 'Ethereum';
      this.className = 'Ethereum';
    }

    createAddressPrivatekey() {
      const t0 = performance.now();

      if (this.mnemonic == '') {
        this.mnemonic = bip39.generateMnemonic(); // generates string
      }
      const seed = bip39.mnemonicToSeed(this.mnemonic); // creates seed buffer
      const root = hdkey.fromMasterSeed(seed);

      // Create address for eth ...
      const addrNode = root.derive(('m/44\'/{0}\'/0\'/0/0').format(this.coinType));

      const pubKey = ethUtil.privateToPublic(addrNode._privateKey);
      const addr = ethUtil.publicToAddress(pubKey).toString('hex');
      const address = ethUtil.toChecksumAddress(addr);
      const privateKey = addrNode._privateKey.toString('hex');

      this.address = address;
      this.privateKey = privateKey;

      this.chainId = this.network == Ethereum.Network.Mainnet ? 1 : 4;

      const t1 = performance.now();
      console.log(`Call to createAddressPrivatekey for each Ether (${address}) took ${t1 - t0} milliseconds.`);
    }

    getWeb3() {
      return new Web3(new Web3.providers.HttpProvider(this.network));
    }

    async getBalance() {
      const web3 = this.getWeb3();
      const balance = await web3.eth.getBalance(this.address);
      return Web3.utils.fromWei(balance.toString());
    }

  async getFee() {
    const web3 = new Web3(new Web3.providers.HttpProvider(this.network));
    const gasPrice = new BN(await web3.eth.getGasPrice());

    const limitedGas = new BN(3000000);

    const estimatedGas = limitedGas.mul(gasPrice);

    // console.log('getFee, gasPrice', gasPrice.toString());
    // console.log('getFee, estimateGas', estimatedGas.toString());

    return Web3.utils.fromWei(estimatedGas);
  }

  async transfer(toAddress, amountToSend) {

    let insufficientMsg = "You have insufficient coin to make the transfer. Please top up and try again."

    try {

      console.log(`transfered from address:${this.address}`);


      const web3 = new Web3(new Web3.providers.HttpProvider(this.network));

      if (!web3.utils.isAddress(toAddress)){
          return {"status": 0, "message": "Please enter a valid receiving address."};
      }
      // check amount:
      let balance = await web3.eth.getBalance(this.address);
      balance = await Web3.utils.fromWei(balance.toString());

      console.log('Your wallet balance is currently {0} ETH'.format(balance));

      if (balance == 0 || balance <= amountToSend) {
        return {"status": 0, "message": insufficientMsg};
      }

      const gasPrice = new BN(await web3.eth.getGasPrice());

      console.log('Current ETH Gas Prices (in GWEI): {0}'.format(gasPrice));

      const nonce = await web3.eth.getTransactionCount(this.address);

      const value = web3.utils.toHex(web3.utils.toWei(amountToSend.toString(), 'ether'));

      console.log('Value to send: {0}'.format(value));

      const details = {
        to: toAddress,
        value,
        gas: 210000,
        gasPrice: await web3.utils.toHex(parseInt(gasPrice)), // converts the gwei price to wei
        nonce,
        chainId: this.chainId,
      };
      console.log('send details: ', details);

      const transaction = new EthereumTx(details);
      transaction.sign(Buffer.from(this.privateKey, 'hex'));
      const serializedTransaction = transaction.serialize();
      const addr = transaction.from.toString('hex');
      console.log('Based on your private key, your wallet address is', addr);
      const transactionId = web3.eth.sendSignedTransaction(`0x${serializedTransaction.toString('hex')}`);
      console.log("transactionId:", transactionId);
      const url = '{0}/tx/{1}'.format(this.network, transactionId);
      console.log("url", url);

      return {"status": 1, "message": "Your transaction will appear on etherscan.io in about 30 seconds."};

    } catch (error) {
        //return {"status": 0, "message": error};
        return {"status": 0, "message": insufficientMsg};
    }
  }

  async getTransactionDetail(txhash) {
    const API_KEY = configs.network[4].apikeyEtherscan;
    const url =this.constructor.API[this.getNetworkName()] + `?module=proxy&action=eth_getTransactionByHash&txhash=${txhash}&apikey=${API_KEY}`;
    const response = await axios.get(url);

    const web3 = new Web3(new Web3.providers.HttpProvider(this.network));

    if (response.status == 200) {
      let detail = response.data.result, result = {};
      result = {
        header: {
          value: Number(web3.utils.hexToNumber(detail.value) / 10000000000000000000),
          coin: "ETH",
          confirmations: web3.utils.hexToNumber(detail.transactionIndex),
          is_sent: this.address.toLowerCase() == detail.from.toLowerCase(),
        },
        body: {
          hash: detail.hash,
          block: web3.utils.hexToNumber(detail.blockNumber),
          gas: web3.utils.hexToNumber(detail.gas),
          gas_price: Number(web3.utils.hexToNumber(detail.gasPrice) / 10000000000000000000).toFixed(web3.utils.hexToNumberString(detail.gasPrice).length) + " ETH",
          from: detail.from,
          to: detail.to,
          nouce: web3.utils.hexToNumber(detail.nouce),
          data: detail.input
        }
      };
      return result;
    }

    return false;
  }

  async getTransactionHistory() {
    const API_KEY = configs.network[4].apikeyEtherscan;
    const url =this.constructor.API[this.getNetworkName()] + `?module=account&action=txlist&address=${this.address}&startblock=0&endblock=99999999&page=1&offset=10&sort=desc&apikey=${API_KEY}`;
    const response = await axios.get(url);
    if (response.status == 200) {
      let result = [];
      for(let tran of response.data.result){
        let value = Number(tran.value / 10000000000000000000),
        transaction_date = new Date(tran.timeStamp*1000), addresses = [],
        is_sent = tran.from.toLowerCase() == this.address.toLowerCase();
        if(is_sent) this.address = tran.to;
        else this.address = tran.from;

        addresses.push(this.getShortAddress());
        result.push({
          value: value,
          transaction_no: tran.hash,
          transaction_date: transaction_date,
          transaction_relative_time:  moment(transaction_date).fromNow(),
          addresses: addresses,
          time_stamp: tran.timeStamp ,
          is_sent: is_sent});
      }

      return result;
    }
    return [];
  }

  // getShortAddress(address) {
  //   let str = String(address);
  //   if(str)
  //     return str.replace(str.substr(5, 32), '...');
  //   return "";
  // }
}

export default { Ethereum };
