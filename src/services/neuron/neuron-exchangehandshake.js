import Web3 from 'web3';
import BaseHandshake from './BaseHandshake';
import {MasterWallet} from '@/models/MasterWallet';

const wallet = MasterWallet.getWalletDefault('ETH');
const address = wallet.address;
const privateKey = wallet.privateKey;
console.log('Address, PrivateKey:', address, privateKey);

const TAG = 'ExchangeHandshake';
export default class ExchangeHandshake extends BaseHandshake {
  constructor(chainId) {
    super(chainId);
  }

  get contractFileNameWithoutExtension() {
    return 'ExchangeHandshake';
  }

  checkBalance = () => {
    const balance = wallet.getBalance();
    return balance;
  }

  /**
   * @dev Initiate handshake by cashOwner
   * @param exchanger exchanger address
   * @param adrFeeRefund adrFeeRefund address
   * @param value funds required for this handshake
   * @param offchain record ID in offchain backend database
   */
  initByCashOwner = (exchanger, adrFeeRefund, value, offchain) => {
    console.log(
      TAG,
      ' initByCashOwner = ',
      exchanger,
      adrFeeRefund,
      value,
      offchain,
    );

    const payoutValue = Web3.utils.toHex(this.web3.utils.toWei(value.toString(), 'ether'));
    const bytesOffchain = this.web3.utils.fromAscii(offchain);

    const payloadData = this.handshakeInstance.methods
      .initByCashOwner(
        exchanger,
        adrFeeRefund,
        payoutValue,
        bytesOffchain,
      )
      .encodeABI();

    console.log('address', address);
    console.log('privateKey', privateKey);

    return this.neuron.makeRawTransaction(address, privateKey, payloadData, {
      // amount: value,
      gasPrice: this.chainId === 4 ? 100 : 20,
      toAddress: this.contractAddress,
    });
  }

  /**
   * @dev Initiate handshake by CoinOwner
   */
  initByCoinOwner = (exchanger, adrFeeRefund, value, offchain) => {
    console.log(
      TAG,
      ' initByCoinOwner = ',
      exchanger,
      adrFeeRefund,
      value,
      offchain,
    );
    const payoutValue = Web3.utils.toHex(this.web3.utils.toWei(value.toString(), 'ether'));
    const bytesOffchain = this.web3.utils.fromAscii(offchain);

    const payloadData = this.handshakeInstance.methods
      .initByCoinOwner(
        exchanger,
        adrFeeRefund,
        payoutValue,
        bytesOffchain,
      )
      .encodeABI();

    return this.neuron.makeRawTransaction(address, privateKey, payloadData, {
      amount: value,
      gasPrice: this.chainId === 4 ? 100 : 20,
      toAddress: this.contractAddress,
    });
  }

  //shaker agree and make a handshake
  shake = (hid, offchain) => {
    console.log(
      TAG,
      ' shake = ',
      hid,
      offchain,
    );
    const bytesOffchain = this.web3.utils.fromAscii(offchain);
    const payloadData = this.handshakeInstance.methods
      .shake(
        hid,
        bytesOffchain,
      )
      .encodeABI();

    return this.neuron.makeRawTransaction(address, privateKey, payloadData, {
      // amount: value,
      gasPrice: this.chainId === 4 ? 100 : 20,
      toAddress: this.contractAddress,
    });
  }

  //CoinOwner accept transaction
  accept = (hid, offchain) => {
    console.log(
      TAG,
      ' accept = ',
      hid,
      offchain,
    );
    const bytesOffchain = this.web3.utils.fromAscii(offchain);
    const payloadData = this.handshakeInstance.methods
      .accept(
        hid,
        bytesOffchain,
      )
      .encodeABI();

    return this.neuron.makeRawTransaction(address, privateKey, payloadData, {
      // amount: value,
      gasPrice: this.chainId === 4 ? 100 : 20,
      toAddress: this.contractAddress,
    });
  }

  //CashOwner withdraw funds from a handshake
  withdraw = (hid, offchain) => {
    console.log(
      TAG,
      ' withdraw = ',
      hid,
      offchain,
    );
    const bytesOffchain = this.web3.utils.fromAscii(offchain);
    const payloadData = this.handshakeInstance.methods
      .withdraw(
        hid,
        bytesOffchain,
      )
      .encodeABI();

    return this.neuron.makeRawTransaction(address, privateKey, payloadData, {
      // amount: value,
      gasPrice: this.chainId === 4 ? 100 : 20,
      toAddress: this.contractAddress,
    });
  }

  //CashOwner reject the transaction
  reject = (hid, offchain) => {
    console.log(
      TAG,
      ' reject = ',
      hid,
      offchain,
    );
    const bytesOffchain = this.web3.utils.fromAscii(offchain);
    const payloadData = this.handshakeInstance.methods
      .reject(
        hid,
        bytesOffchain,
      )
      .encodeABI();

    return this.neuron.makeRawTransaction(address, privateKey, payloadData, {
      // amount: value,
      gasPrice: this.chainId === 4 ? 100 : 20,
      toAddress: this.contractAddress,
    });
  }

  //coinOwner cancel the handshake
  cancel = (hid, offchain) => {
    console.log(
      TAG,
      ' cancel = ',
      hid,
      offchain,
    );
    const bytesOffchain = this.web3.utils.fromAscii(offchain);
    const payloadData = this.handshakeInstance.methods
      .cancel(
        hid,
        bytesOffchain,
      )
      .encodeABI();

    return this.neuron.makeRawTransaction(address, privateKey, payloadData, {
      // amount: value,
      gasPrice: this.chainId === 4 ? 100 : 20,
      toAddress: this.contractAddress,
    });
  }

  //CashOwner close the transaction after init
  closeByCashOwner = (hid, offchain) => {
    console.log(
      TAG,
      ' closeByCashOwner = ',
      hid,
      offchain,
    );
    const bytesOffchain = this.web3.utils.fromAscii(offchain);
    const payloadData = this.handshakeInstance.methods
      .close(
        hid,
        bytesOffchain,
      )
      .encodeABI();

    return this.neuron.makeRawTransaction(address, privateKey, payloadData, {
      // amount: value,
      gasPrice: this.chainId === 4 ? 100 : 20,
      toAddress: this.contractAddress,
    });
  }

  //get handshake stage by hid
  getState = (hid) => {
    console.log(
      TAG,
      ' getState = ',
      hid,
    );
    const payloadData = this.handshakeInstance.methods
      .getState(
        hid,
      )
      .encodeABI();

    return this.neuron.makeRawTransaction(address, privateKey, payloadData, {
      // amount: value,
      gasPrice: this.chainId === 4 ? 100 : 20,
      toAddress: this.contractAddress,
    });
  }
}
