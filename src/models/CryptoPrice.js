class CryptoPrice {
  static cryptoPrice(data) {
    return {
      amount: data.amount || '',
      currency: data.currency || '',
      fiatAmount: data.fiat_amount || '',
      fiatCurrency: data.fiat_currency || '',
    };
  }
}

export default CryptoPrice;
