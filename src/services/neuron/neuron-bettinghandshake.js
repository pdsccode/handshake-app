import Web3 from 'web3';
import BaseHandshake from './BaseHandshake';

const TAG = 'BettingHandshake';
export default class BettingHandshake extends BaseHandshake {
  constructor(chainId) {
    super(chainId);
  }
  get contractFileNameWithoutExtension() {
    return 'BettingHandshake';
  }
  initBet = (
    address,
    privateKey,
    hid,
    side,
    payout,
    offchain,
  ) => {
    console.log(
      TAG,
      ' init = ',
      address,
      privateKey,
      hid,
      side,
      payout,
      offchain,
    );
    console.log(TAG, ' initBet ', this.contractAddress);
    const payoutValue = Web3.utils.toWei(payout.toString(), 'ether');
    const bytesOffchain = this.web3.utils.fromAscii(offchain);

    const payloadData = this.handshakeInstance.methods
      .initBet(
        hid,
        side,
        payoutValue,
        bytesOffchain,
      )
      .encodeABI();

    return this.neuron.makeRawTransaction(address, privateKey, payloadData, {
      amount: payout,
      gasPrice: this.chainId === 4 ? 100 : 20,
      toAddress: this.contractAddress,
    });
  };
 
  shake = (address, privateKey, hid, side, payout, maker, offchain) => {
    console.log('eth-contract-service shake', address, privateKey, hid);
    const payoutValue = Web3.utils.toWei(payout.toString(), 'ether');
    const bytesOffchain = this.web3.utils.fromAscii(offchain);

    const payloadData = this.handshakeInstance.methods
      .shake(hid,side,payoutValue, maker, bytesOffchain)
      .encodeABI();
    return this.neuron.makeRawTransaction(address, privateKey, payloadData, {
      amount: payout,
      toAddress: this.contractAddress,
    });
  };
  //Cancel Bet when it isn't matched
  cancelBet = (address, privateKey, hid, side, stake, payout, offchain) => {
    console.log(
      'eth-contract-service cancel',
      address,
      privateKey,
      hid,
      side,
      stake,
      payout,
      offchain,
    );
    const bytesOffchain = this.web3.utils.fromAscii(offchain);
    const payloadData = this.handshakeInstance.methods
      .uninit(hid, side, stake, payout, bytesOffchain)
      .encodeABI();
    return this.neuron.makeRawTransaction(address, privateKey, payloadData, {
      // amount,
      toAddress: this.contractAddress,
    });
  };
  /*
  closeBet = (address, privateKey, hid, offchain) => {
    console.log(
      'eth-contract-service cancel',
      address,
      privateKey,
      hid,
      offchain,
    );
    const bytesOffchain = this.web3.utils.fromAscii(offchain);
    const payloadData = this.handshakeInstance.methods
      .closeBet(hid, state, bytesOffchain)
      .encodeABI();
    return this.neuron.makeRawTransaction(address, privateKey, payloadData, {
      // amount,
      toAddress: this.contractAddress,
    });
  };
  iniatorWon = (address, privateKey, hid, offchain) => {
    console.log(
      'eth-contract-service cancel',
      address,
      privateKey,
      hid,
      offchain,
    );
    const bytesOffchain = this.web3.utils.fromAscii(offchain);
    const payloadData = this.handshakeInstance.methods
      .initiatorWon(hid, state, bytesOffchain)
      .encodeABI();
    return this.neuron.makeRawTransaction(address, privateKey, payloadData, {
      // amount,
      toAddress: this.configs.handshakeBettingAddress,
    });
  };
  betorWon = (address, privateKey, hid, offchain) => {
    console.log(
      'eth-contract-service cancel',
      address,
      privateKey,
      hid,
      offchain,
    );
    const bytesOffchain = this.web3.utils.fromAscii(offchain);
    const payloadData = this.handshakeInstance.methods
      .betorWon(hid, state, bytesOffchain)
      .encodeABI();
    return this.neuron.makeRawTransaction(address, privateKey, payloadData, {
      // amount,
      toAddress: this.contractAddressax,
    });
  };
  draw = (address, privateKey, hid, offchain) => {
    console.log(
      'eth-contract-service cancel',
      address,
      privateKey,
      hid,
      offchain,
    );
    const bytesOffchain = this.web3.utils.fromAscii(offchain);
    const payloadData = this.handshakeInstance.methods
      .draw(hid, state, balanceValue, escrowValue, bytesOffchain)
      .encodeABI();
    return this.neuron.makeRawTransaction(address, privateKey, payloadData, {
      // amount,
      toAddress: this.contractAddress,
    });
  };
  */
  
  withdraw = (address, privateKey, hid, offchain) => {
    console.log(
      'eth-contract-service withdraw',
      address,
      privateKey,
      hid,
      offchain,
    );
    const bytesOffchain = this.web3.utils.fromAscii(offchain);

    const payloadData = this.handshakeInstance.methods
      .collect(hid, bytesOffchain)
      .encodeABI();
    return this.neuron.makeRawTransaction(address, privateKey, payloadData, {
      // amount,
      toAddress: this.contractAddress,
    });
  };
  /*
  reject = (address, privateKey, hid, offchain) => {
    console.log(
      'eth-contract-service reject',
      address,
      privateKey,
      hid,
      offchain,
    );
    const bytesOffchain = this.web3.utils.fromAscii(offchain);

    const payloadData = this.handshakeInstance.methods
      .reject(hid, bytesOffchain)
      .encodeABI();
    return this.neuron.makeRawTransaction(address, privateKey, payloadData, {
      // amount,
      toAddress: this.contractAddress,
    });
  };
  setWinner = (address, privateKey, hid, result, offchain) => {
    console.log(
      'eth-contract-service cancel',
      address,
      privateKey,
      hid,
      result,
      offchain,
    );
    const bytesOffchain = this.web3.utils.fromAscii(offchain);
    const payloadData = this.handshakeInstance.methods
      .setWinner(hid, state, result, bytesOffchain)
      .encodeABI();
    return this.neuron.makeRawTransaction(address, privateKey, payloadData, {
      // amount,
      toAddress: this.contractAddress,
    });
  };
  */
}
