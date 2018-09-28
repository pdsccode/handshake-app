class CashStoreTransaction {
  static cashStoreTransaction(data) {
    return {
      id: data.id || '',
      amount: data.amount || '',
      currency: data.currency || '',
      fiatAmount: data.fiat_amount || '0',
      fiatCurrency: data.fiat_currency || '0',
      fiat_local_amount: data.fiat_local_amount || '0',
      fiat_local_currency: data.fiat_local_currency || '',
      store_fee: data.store_fee || '0',
      center: data.center || '',
      address: data.address || '',
    };
  }
}

export default CashStoreTransaction;
