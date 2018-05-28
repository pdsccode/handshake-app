import Web3 from 'web3';
import configs from '../../configs';

export default class Handshake {
  constructor(_neuron) {
    const web3 = _neuron.getWeb3();
    const compiled = _neuron.getCompiled('BettingHandshake');
    this.handshakeInstance = new web3.eth.Contract(
      compiled.abi,
      configs.handshakeBettingAddress,
    );
    this.neuron = _neuron;
    this.web3 = web3;
  }
  initBet = (
    address,
    privateKey,
    goal,
    escrow,
    deadline,
    offchain,
  ) => {
    console.log(
      'eth-contract-service init',
      address,
      privateKey,
      goal,
      escrow,
      deadline,
      offchain,
    );
    const goalValue = Web3.utils.toWei(goal.toString(), 'ether');
    const escrowValue = Web3.utils.toWei(escrow.toString(), 'ether');
    const payloadData = this.handshakeInstance.methods
      .init('', goalValue, escrowValue, deadline, offchain)
      .encodeABI();
    return this.neuron.makeRawTransaction(address, privateKey, payloadData, {
        value: escrowValue,
        toAddress: configs.handshakeBettingAddress,
    });
  };
 
  shake = (address, privateKey, hid, state, balance,escrow, offchain) => {
    console.log('eth-contract-service shake', address, privateKey, hid);
    const payloadData = this.handshakeInstance.methods
      .shake(hid, offchain)
      .encodeABI();
    return this.neuron.makeRawTransaction(address, privateKey, payloadData, {
      amount,
      toAddress: configs.handshakeAddress,
    });
  };
  unshake = (address, privateKey, amount, hid, offchain) => {
    console.log(
      'eth-contract-service unshake',
      address,
      privateKey,
      amount,
      hid,
      offchain,
    );
    const payloadData = this.handshakeInstance.methods
      .unshake(hid, offchain)
      .encodeABI();
    return this.neuron.makeRawTransaction(address, privateKey, payloadData, {
      amount,
      toAddress: configs.handshakeAddress,
    });
  };
  deliver = (address, privateKey, amount, hid, offchain) => {
    console.log(
      'eth-contract-service deliver',
      address,
      privateKey,
      amount,
      hid,
      offchain,
    );
    const payloadData = this.handshakeInstance.methods
      .deliver(hid, offchain)
      .encodeABI();
    return this.neuron.makeRawTransaction(address, privateKey, payloadData, {
      amount,
      toAddress: configs.handshakeAddress,
    });
  };
  withdraw = (address, privateKey, amount, hid, offchain) => {
    console.log(
      'eth-contract-service withdraw',
      address,
      privateKey,
      amount,
      hid,
      offchain,
    );
    const payloadData = this.handshakeInstance.methods
      .withdraw(hid, offchain)
      .encodeABI();
    return this.neuron.makeRawTransaction(address, privateKey, payloadData, {
      amount,
      toAddress: configs.handshakeAddress,
    });
  };
  reject = (address, privateKey, amount, hid, offchain) => {
    console.log(
      'eth-contract-service reject',
      address,
      privateKey,
      amount,
      hid,
      offchain,
    );
    const payloadData = this.handshakeInstance.methods
      .reject(hid, offchain)
      .encodeABI();
    return this.neuron.makeRawTransaction(address, privateKey, payloadData, {
      amount,
      toAddress: configs.handshakeAddress,
    });
  };
  accept = (address, privateKey, amount, hid, offchain) => {
    console.log(
      'eth-contract-service accept',
      address,
      privateKey,
      amount,
      hid,
      offchain,
    );
    const payloadData = this.handshakeInstance.methods
      .accept(hid, offchain, offchain)
      .encodeABI();
    return this.neuron.makeRawTransaction(address, privateKey, payloadData, {
      amount,
      toAddress: configs.handshakeAddress,
    });
  };
  cancel = (address, privateKey, amount, hid, offchain) => {
    console.log(
      'eth-contract-service cancel',
      address,
      privateKey,
      amount,
      hid,
      offchain,
    );
    const payloadData = this.handshakeInstance.methods
      .cancel(hid, offchain)
      .encodeABI();
    return this.neuron.makeRawTransaction(address, privateKey, payloadData, {
      amount,
      toAddress: configs.handshakeAddress,
    });
  };
}
