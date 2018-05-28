import Web3 from 'web3';
import configsBetting from '../../configs';
const configs =  configsBetting.network[4];
export default class BettingHandshake {
  constructor(_neuron) {
    const web3 = _neuron.getWeb3();
    const compiled = _neuron.getCompiled('BettingHandshake');
    this.handshakeInstance = new web3.eth.Contract(
      compiled.abi,
      configs.handshakeBettingAddress,
    );
    console.log("Hanshake instance:", this.handshakeInstance);
    this.neuron = _neuron;
    this.web3 = web3;
  }
  initBet = (
    address,
    privateKey,
    acceptors = [],
    goal,
    escrow,
    deadline,
    offchain,
  ) => {
    console.log(
      'eth-contract-service init contractAddress = ',
      configs.handshakeBettingAddress,
      address,
      privateKey,
      goal,
      escrow,
      deadline,
      offchain,
    );
    const goalValue = Web3.utils.toWei(goal.toString(), 'ether');
    const escrowValue = Web3.utils.toWei(escrow.toString(), 'ether');
    const bytesOffchain = this.web3.utils.fromAscii(offchain);
    const payloadData = this.handshakeInstance.methods
      .initBet(acceptors, goalValue, escrowValue, deadline, bytesOffchain)
      .encodeABI();
    return this.neuron.makeRawTransaction(address, privateKey, payloadData, {
        value: escrowValue,
        gasPrice: (() => (this.neuron.chainId === 4 ? 100 : 20))(),
        toAddress: configs.handshakeBettingAddress,
    });
  };
 
  shake = (address, privateKey, hid, state, balance, escrow, offchain) => {
    console.log('eth-contract-service shake', address, privateKey, hid);
    const escrowValue = Web3.utils.toWei(escrow.toString(), 'ether');
    const balanceValue = Web3.utils.toWei(balance.toString(), 'ether');
    const bytesOffchain = this.web3.utils.fromAscii(offchain);

    const payloadData = this.handshakeInstance.methods
      .shake(hid, state, balanceValue, escrowValue, bytesOffchain)
      .encodeABI();
    return this.neuron.makeRawTransaction(address, privateKey, payloadData, {
      value: escrowValue,
      toAddress: configs.handshakeBettingAddress,
    });
  };
  cancelBet = (address, privateKey, hid, state, balance, escrow, offchain) => {
    console.log(
      'eth-contract-service cancel',
      address,
      privateKey,
      hid,
      state,
      balance,
      escrow,
      offchain,
    );
    const bytesOffchain = this.web3.utils.fromAscii(offchain);
    const balanceValue = Web3.utils.toWei(balance.toString(), 'ether');
    const escrowValue = Web3.utils.toWei(escrow.toString(), 'ether');
    const payloadData = this.handshakeInstance.methods
      .cancelBet(hid, state, balanceValue, escrowValue, bytesOffchain)
      .encodeABI();
    return this.neuron.makeRawTransaction(address, privateKey, payloadData, {
      //amount,
      toAddress: configs.handshakeBettingAddress,
    });
  };
  closeBet = (address, privateKey, hid, state, balance, escrow, offchain) => {
    console.log(
      'eth-contract-service cancel',
      address,
      privateKey,
      hid,
      state,
      balance,
      escrow,
      offchain,
    );
    const bytesOffchain = this.web3.utils.fromAscii(offchain);
    const balanceValue = Web3.utils.toWei(balance.toString(), 'ether');
    const escrowValue = Web3.utils.toWei(escrow.toString(), 'ether');
    const payloadData = this.handshakeInstance.methods
      .closeBet(hid, state, balanceValue, escrowValue, bytesOffchain)
      .encodeABI();
    return this.neuron.makeRawTransaction(address, privateKey, payloadData, {
      //amount,
      toAddress: configs.handshakeBettingAddress,
    });
  };
  iniatorWon = (address, privateKey, hid, state, balance, escrow, offchain) => {
    console.log(
      'eth-contract-service cancel',
      address,
      privateKey,
      hid,
      state,
      balance,
      escrow,
      offchain,
    );
    const bytesOffchain = this.web3.utils.fromAscii(offchain);
    const balanceValue = Web3.utils.toWei(balance.toString(), 'ether');
    const escrowValue = Web3.utils.toWei(escrow.toString(), 'ether');
    const payloadData = this.handshakeInstance.methods
      .initiatorWon(hid, state, balanceValue, escrowValue, bytesOffchain)
      .encodeABI();
    return this.neuron.makeRawTransaction(address, privateKey, payloadData, {
      //amount,
      toAddress: configs.handshakeBettingAddress,
    });
  };
  betorWon = (address, privateKey, hid, state, balance, escrow, offchain) => {
    console.log(
      'eth-contract-service cancel',
      address,
      privateKey,
      hid,
      state,
      balance,
      escrow,
      offchain,
    );
    const bytesOffchain = this.web3.utils.fromAscii(offchain);
    const balanceValue = Web3.utils.toWei(balance.toString(), 'ether');
    const escrowValue = Web3.utils.toWei(escrow.toString(), 'ether');
    const payloadData = this.handshakeInstance.methods
      .betorWon(hid, state, balanceValue, escrowValue, bytesOffchain)
      .encodeABI();
    return this.neuron.makeRawTransaction(address, privateKey, payloadData, {
      //amount,
      toAddress: configs.handshakeBettingAddress,
    });
  };
  draw = (address, privateKey, hid, state, balance, escrow, offchain) => {
    console.log(
      'eth-contract-service cancel',
      address,
      privateKey,
      hid,
      state,
      balance,
      escrow,
      offchain,
    );
    const bytesOffchain = this.web3.utils.fromAscii(offchain);
    const balanceValue = Web3.utils.toWei(balance.toString(), 'ether');
    const escrowValue = Web3.utils.toWei(escrow.toString(), 'ether');
    const payloadData = this.handshakeInstance.methods
      .draw(hid, state, balanceValue, escrowValue, bytesOffchain)
      .encodeABI();
    return this.neuron.makeRawTransaction(address, privateKey, payloadData, {
      //amount,
      toAddress: configs.handshakeBettingAddress,
    });
  };
  
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
      .withdraw(hid, bytesOffchain)
      .encodeABI();
    return this.neuron.makeRawTransaction(address, privateKey, payloadData, {
      //amount,
      toAddress: configs.handshakeBettingAddress,
    });
  };
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
      //amount,
      toAddress: configs.handshakeBettingAddress,
    });
  };
  setWinner = (address, privateKey, hid, state, balance, escrow, offchain) => {
    console.log(
      'eth-contract-service cancel',
      address,
      privateKey,
      hid,
      state,
      balance,
      escrow,
      offchain,
    );
    const bytesOffchain = this.web3.utils.fromAscii(offchain);
    const balanceValue = Web3.utils.toWei(balance.toString(), 'ether');
    const escrowValue = Web3.utils.toWei(escrow.toString(), 'ether');
    const payloadData = this.handshakeInstance.methods
      .setWinner(hid, state, balanceValue, escrowValue, bytesOffchain)
      .encodeABI();
    return this.neuron.makeRawTransaction(address, privateKey, payloadData, {
      //amount,
      toAddress: configs.handshakeBettingAddress,
    });
  };
}
