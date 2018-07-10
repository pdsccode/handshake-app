import axios from 'axios';
import { Wallet } from '@/services/Wallets/Wallet.js';
import configs from '@/configs';
import { StringHelper } from '@/services/helper';
import {MasterWallet} from "./MasterWallet";
import Tx from 'ethereumjs-tx';

const Web3 = require('web3');
const EthereumTx = require('ethereumjs-tx');
const hdkey = require('hdkey');
const ethUtil = require('ethereumjs-util');
const bip39 = require('bip39');
const moment = require('moment');
const BN = Web3.utils.BN;

export class Ethereum extends Wallet {
  static Network = { Mainnet: 'https://mainnet.infura.io/', Rinkeby: 'https://rinkeby.infura.io/' }
  static API = { Mainnet: 'https://api.etherscan.io/api', Rinkeby: 'https://api-rinkeby.etherscan.io/api' }

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
    const addrNode = root.derive(StringHelper.format('m/44\'/{0}\'/0\'/0/0', this.coinType));

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
    try {
      const web3 = this.getWeb3();
      const balance = await web3.eth.getBalance(this.address);
      return Web3.utils.fromWei(balance.toString());
    } catch (error) { return 0; }
  }

  async getFee() {
    const wallet = MasterWallet.getWalletDefault('ETH');
    const neuron = wallet.chainId === 4 ? MasterWallet.neutronTestNet : MasterWallet.neutronMainNet; // new Neuron(chainId);
    return neuron.caculateLimitGasWithEthUnit(neuron.gasPrice);

    // const web3 = new Web3(new Web3.providers.HttpProvider(this.network));
    // const gasPrice = new BN(await web3.eth.getGasPrice());
    //
    // const limitedGas = new BN(150000);
    //
    // const estimatedGas = limitedGas.mul(gasPrice);

    // console.log('getFee, gasPrice', gasPrice.toString());
    // console.log('getFee, estimateGas', estimatedGas.toString());

    // return Web3.utils.fromWei(estimatedGas);
  }

  async getTransactionReceipt(hash) {

    const web3 = new Web3(new Web3.providers.HttpProvider(this.network));
    const receipt = await web3.eth.getTransactionReceipt(hash);
    console.log(receipt);
    return null;
  }


  checkAddressValid(toAddress) {
    const web3 = new Web3(new Web3.providers.HttpProvider(this.network));

    if (!web3.utils.isAddress(toAddress)) {
      return 'messages.ethereum.error.invalid_address';
    }
    return true;
  }

  async transfer(toAddress, amountToSend) {
    const web3 = this.getWeb3();

    if (!web3.utils.isAddress(toAddress)) {
      return { status: 0, message: 'messages.ethereum.error.invalid_address2' };
    }

    try {

      let balance = await web3.eth.getBalance(this.address);
      balance = await Web3.utils.fromWei(balance.toString());

      if (balance == 0 || balance <= amountToSend) {
        return { status: 0, message: 'messages.ethereum.error.insufficient' };
      }

      const gasPrice = new BN(await web3.eth.getGasPrice());
      const estimateGas = new BN(balance).div(gasPrice);
      const limitedGas = 210000;
      const estimatedGas = await BN.min(estimateGas, limitedGas);
      const chainId = await web3.eth.net.getId();

      console.log('transfer gasPrice->', parseInt(gasPrice));
      console.log('transfer estimatedGas->', String(estimatedGas));
      console.log('transfer limitedGas->', String(limitedGas));
      console.log('transfer chainid->', chainId);
      //console.log('transfer payloadData', payloadData);

      const totalAmountFee = Number(amountToSend)+Number(web3.utils.fromWei(String(limitedGas * gasPrice)));
      if(totalAmountFee > balance) {
        console.log(totalAmountFee, balance, Number(web3.utils.fromWei(String(limitedGas * gasPrice))));
        return { status: 0, message: 'messages.ethereum.error.insufficient_gas' };
      }

      return this.getNonce(this.address).then((_nonce) => {
        const nonce = _nonce;
        const rawTx = {
          nonce: web3.utils.toHex(nonce),
          gasPrice: web3.utils.toHex(gasPrice),
          gasLimit: estimatedGas,
          data: "",
          from: this.address,
          chainId: this.chainId,
          to: toAddress,
        };
        console.log('rawTx->', rawTx);
        const tx = new Tx(rawTx);
        if (amountToSend) {
          tx.value = Web3.utils.toHex(web3.utils.toWei(String(amountToSend), 'ether'));
        }
        tx.sign(Buffer.from(this.privateKey, 'hex'));
        const serializedTx = tx.serialize();
        const rawTxHex = `0x${serializedTx.toString('hex')}`;
        return new Promise((resolve, reject) => {
          web3.eth
            .sendSignedTransaction(rawTxHex)
            .on('transactionHash', (hash) => {

              console.log("hash", hash);
              resolve({ status: 1, message: 'messages.ethereum.success.transaction',
                data: {hash: hash}
              });
            })
            .on('error', error => ({
              hash: -1,
              error,
            }));
        });
      })
      .catch(error => {
        console.log("error", error);
        return { status: 0, message: 'messages.ethereum.error.insufficient' };
      });

    } catch (error) {
      console.log("error", error);
      return { status: 0, message: 'messages.ethereum.error.insufficient' };
    }
  }

   async getNonce(accountAddress){
    const web3 = this.getWeb3();
    const nonce = await web3.eth
      .getTransactionCount(accountAddress, 'pending', (error, result) => {
        console.log(' getNonce error', error, ' result = ', result);
      })
      .then((_nonce) => {
        this.lastResultNonce =
          this.lastResultNonce >= _nonce ? this.lastResultNonce + 1 : _nonce;
        console.log('getNonce 0000-- ', this.lastResultNonce);
        return this.lastResultNonce;
      });
    return nonce;
  };

  async getTransactionHistory(pageno) {
    let result = [];
    const API_KEY = configs.network[4].apikeyEtherscan;
    const url = `${this.constructor.API[this.getNetworkName()]}?module=account&action=txlist&address=${this.address}&startblock=0&endblock=99999999&page=${pageno}&offset=20&sort=desc&apikey=${API_KEY}`;
    const response = await axios.get(url);
    if (response.status == 200) {
      result = response.data.result;
    }
    return result;
  }

  async getTransactionCount() {
    let result = [];
    const API_KEY = configs.network[4].apikeyEtherscan;
    const url = `${this.constructor.API[this.getNetworkName()]}?module=proxy&action=eth_getTransactionCount&address=${this.address}&tag=latest&apikey=${API_KEY}`;
    const response = await axios.get(url);
    if (response.status == 200) {
      const web3 = this.getWeb3();
      result = web3.utils.hexToNumber(response.data.result);
    }
    return result;
  }

  cook(data){
    let value = 0, transaction_date = new Date(), addresses = [],
      is_sent = true, is_error = false, transaction_no = "", token = {}, coin_name = "ETH";

    if(data){
      try{
        value = Number(data.value / 1000000000000000000);
        transaction_date = new Date(data.timeStamp*1000);
        is_sent = String(data.from).toLowerCase() == this.address.toLowerCase();
        is_error = Boolean(data.isError == "1");
        transaction_no = data.hash;
      }
      catch(e){
        console.error(e);
      }

      let addr = data.from;
      if(is_sent) addr = data.to;

      token = this.checkToken(addr);
      if(token.result){
        coin_name = token.name
        let a = this.getTransactionReceipt(transaction_no);
      }

      addresses.push(addr.replace(addr.substr(4, 34), '...'));
    }

    return {
      coin_name: coin_name,
      value: value,
      transaction_no: transaction_no,
      transaction_date: transaction_date,
      transaction_relative_time:  moment(transaction_date).fromNow(),
      addresses: addresses,
      is_sent: is_sent,
      is_error: is_error
    };
  }

  checkToken(addr){
    return {result: addr == "0xc2f227834af7b44a11a9286f1771cade7ecd316c", name: "SHURI"}
  }

  getTokenValue(hash){

  }
}


export default { Ethereum };