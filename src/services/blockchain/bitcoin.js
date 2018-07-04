import bitcore from 'bitcore-lib';
import axios from 'axios';
import satoshi from 'satoshi-bitcoin';

class BitcoinConnection {
  connectTo(endpoint) {
    this.network = endpoint;

    this.connection = bitcore;
    return this;
  }

  async getBalance(address) {
    const url = `${this.network}/addr/${address}/balance`;
    const response = await axios.get(url);
    if (response.status === 200) {
      const balance = await satoshi.toBitcoin(response.data);
      return balance;
    }
    return false;
  }
}

export default BitcoinConnection;
