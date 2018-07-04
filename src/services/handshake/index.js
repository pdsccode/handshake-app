// handshakes
import HandshakeExchange from '@/services/handshake/exchange';
import HandshakeExchangeShop from '@/services/handshake/exchange-shop';
import HandshakePrediction from '@/services/handshake/prediction';

class Handshake {
  constructor(connect) {
    this.connect = connect;
    this.contracts = {
      exchange: new HandshakeExchange(),
      exchangeShop: new HandshakeExchangeShop(),
      prediction: new HandshakePrediction(),
    };
    return this;
  }
  setWallet(wallet) {
    this.wallet = wallet;
    return this;
  }
}

export default Handshake;
