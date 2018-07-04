import bip39 from 'bip39';

class Wallet {
  constructor(init, blockchain) {
    this.data = init;
    this.blockchain = blockchain;
  }

  static randomMnemonic() {
    return bip39.generateMnemonic();
  }

  async getBalance() {
    const balance = await this.blockchain.connect.getBalance(this.data.address);
    return balance;
  }
}

export default Wallet;
