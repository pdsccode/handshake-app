import Web3 from 'web3';

class EthereumConnection {
  connectTo(endpoint) {
    this.network = endpoint;

    this.connection = new Web3(new Web3.providers.HttpProvider(this.network));
    return this;
  }

  async getBalance(address) {
    const balance = await this.connection.eth.getBalance(address);

    return Web3.utils.fromWei(balance);
  }
}

export default EthereumConnection;
