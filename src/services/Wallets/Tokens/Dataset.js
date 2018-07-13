import axios from 'axios';
import { Wallet } from '@/services/Wallets/Wallet.js';
import { StringHelper } from '@/services/helper';
import { Ethereum } from '@/services/Wallets/Ethereum.js';
import Tx from 'ethereumjs-tx';

const Web3 = require('web3');
const BN = Web3.utils.BN;
const BigNumber = require('bignumber.js');

const EthereumTx = require('ethereumjs-tx');

const compiled = require('@/contracts/Dataset.json');
// var erc20Abi = compiled.abi;
console.log(compiled)

const CONTRACT_ADDRESS = process.env.DATASET_CONTRACT_ADDRESS;

export class Dataset extends Ethereum {

    constructor() {
      super();
      this.className = 'Dataset';
      this.isToken = true;
      this.contractAddress = '';
      this.decimals = 18;
      this.customToken = true;
    }

    createFromWallet(wallet){
      this.network = wallet.network;
      this.address = wallet.address;
      this.chainId = wallet.chainId;
      this.coinType = wallet.coinType;
      this.privateKey = wallet.privateKey;
      this.protected = wallet.protected;
      this.mnemonic = wallet.mnemonic;
    }

    async getContractInfo(contractAddress){
      this.contractAddress = contractAddress;
      try{
        const web3 = this.getWeb3();
        let instance = new web3.eth.Contract(
            erc20Abi,
            this.contractAddress,
        );
        this.title = await instance.methods.name().call();
        this.name = await instance.methods.symbol().call();
        try{
          this.decimals = await instance.methods.decimals().call();
        }
        catch (e){
          console.log("error: ", e);
          this.decimals = "0";
        }
        return true;

      }
      catch (e){
        console.log("error: ", e);
      }
      return false;
    }

    async buy(datasetId, value) {
      try {
        console.log(`buying dataset ${datasetId} from address: ${this.address}`);

        const web3 = this.getWeb3();
        const contract = new web3.eth.Contract(
          compiled,
          CONTRACT_ADDRESS,
        );

        const data = web3.eth.abi.encodeFunctionCall({
          name: 'buy',
          type: 'function',
          inputs: [
            {
              type: 'uint32',
              name: 'dsId'
            }
          ]
        }, [datasetId])

        const nonce = await web3.eth.getTransactionCount(this.address);
        // const gasPrice = web3.utils.toHex(web3.eth.gasPrice);

        const rawTx = {
          nonce,
          gasLimit: web3.utils.toHex(150000),
          gasPrice: web3.utils.toHex(10e9),
          from: this.address,
          to: CONTRACT_ADDRESS,
          value: web3.utils.toHex(web3.utils.toWei('1')),
          data
        };
        const tx = new Tx(rawTx);
        const privateKey = new Buffer(this.privateKey, 'hex');
        tx.sign(privateKey);

        const serializedTx = tx.serialize().toString('hex');
        const txHash = await web3.eth.sendSignedTransaction('0x' + serializedTx);
        console.log(txHash);
        return txHash;
      } catch (e) {
        throw e;
      }
    }

    async getBalance(){
      const web3 = this.getWeb3();
      let contract = new web3.eth.Contract(
        erc20Abi,
        this.contractAddress
      );

      let balanceOf = await contract.methods.balanceOf(this.address).call();

      let tokenBalance = new BigNumber(balanceOf) / Math.pow(10, this.decimals)

      return tokenBalance;

    }

    async transfer(toAddress, amountToSend) {

      let insufficientMsg = "You have insufficient coin to make the transfer. Please top up and try again."

      try {

        console.log(`transfered from address:${this.address} to address: ${toAddress}`);


        const web3 = this.getWeb3();

        if (!web3.utils.isAddress(toAddress)){
            return {"status": 0, "message": "Please enter a valid receiving address."};
        }
        // check amount:
        let balance = await this.getBalance();

        console.log(StringHelper.format('Your wallet balance is currently {0} {1}', balance, this.name));

        if (balance == 0 || balance <= amountToSend) {
          return {"status": 0, "message": insufficientMsg};
        }

        const gasPrice = new BN(await web3.eth.getGasPrice());

        console.log(StringHelper.format('Current ETH Gas Prices (in GWEI): {0}', gasPrice));

        const nonce = await web3.eth.getTransactionCount(this.address);

        let bigAmount = new BigNumber(amountToSend.toString()) * Math.pow(10, this.decimals)
        const tokenValue =  web3.utils.toHex(bigAmount)

        console.log(StringHelper.format('Tokens to send: {0}', tokenValue));

        // get contract:
        let contract = new web3.eth.Contract(erc20Abi, this.contractAddress, {from: this.address});

        const details = {
          from: this.address,
          to: this.contractAddress,
          value: "0x0",
          gas: 210000,
          gasLimit: web3.utils.toHex(210000),
          gasPrice: await web3.utils.toHex(parseInt(gasPrice)),
          nonce,
          data: contract.methods.transfer(toAddress, tokenValue).encodeABI(),
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
        const url = StringHelper.format('{0}/tx/{1}', this.network, transactionId);
        console.log("url", url);

        return {"status": 1, "message": "Your transaction will appear on etherscan.io in about 30 seconds."};

      } catch (error) {
        console.log("send error: ", error);
          //return {"status": 0, "message": error};
          return {"status": 0, "message": insufficientMsg};
      }
    }

}

export default { Dataset };