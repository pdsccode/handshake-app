// blockchains
import EthereumConnection from '@/services/blockchain/ethereum';
import BitcoinConnection from '@/services/blockchain/bitcoin';

class Blockchain {
  constructor(type) {
    this.type = type;
    switch (this.type) {
      case 'ETH': {
        this.isETH = true;
        this.connect = new EthereumConnection();
        break;
      }
      case 'BTC': {
        this.isBTC = true;
        this.connect = new BitcoinConnection();
        break;
      }
      default: {
        throw Error('This blockchain type is not valid');
      }
    }
    return this;
  }
}

export default Blockchain;
