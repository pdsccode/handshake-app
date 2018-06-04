import axios from 'axios';
import { Wallet } from '@/models/Wallet.js';

const Web3 = require('web3');
const EthereumTx = require('ethereumjs-tx');
const hdkey = require('hdkey');
const ethUtil = require('ethereumjs-util');
const bip39 = require('bip39');

const BN = Web3.utils.BN;

export class Ethereum extends Wallet {
    static Network = { Mainnet: 'https://mainnet.infura.io/', Rinkeby: 'https://rinkeby.infura.io/' }

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

    async transfer(toAddress, amountToSend) {
      try {

        console.log(`transfered from address:${this.address}`);


        const web3 = new Web3(new Web3.providers.HttpProvider(this.network));

        if (!web3.utils.isAddress(toAddress)){
            return {"status": 0, "message": "Recipient address is invalid"};
        }
        // check amount:
        let balance = await web3.eth.getBalance(this.address);
        balance = await Web3.utils.fromWei(balance.toString());

        console.log('Your wallet balance is currently {0} ETH'.format(balance));

        if (balance == 0 || balance <= amountToSend) {
          return {"status": 0, "message": "Insufficient funds"};
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

        return {"status": 1, "message": "Please allow for 30 seconds before transaction appears etherscan.io"};

      } catch (error) {
          return {"status": 0, "message": error};
      }
    }

    async getTransactionHistory() {
      const API_KEY = 'AVBIHJUF3G4ZY2CHZI6F4RVBFWC3A3EIVB';
      const url = `https://api-rinkeby.etherscan.io/api?module=transaction&action=gettxreceiptstatus&txhash=${this.address}&apikey=${API_KEY}`;
      const response = await axios.get(url);
      console.log(url);
      if (response.status == 200) {
        console.log(response.data);
        return response.data;
      }
      return false;
    }
}

export default { Ethereum };
