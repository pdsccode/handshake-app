class CashStoreTransaction {
  static cashStoreTransaction(data) {
    return {
      id: data.id || '',
      amount: data.amount || '',
      currency: data.currency || '',
      fiatAmount: data.fiat_amount || '0',
      fiatCurrency: data.fiat_currency || '0',
      fiatLocalAmount: data.fiat_local_amount || '0',
      fiatLocalCurrency: data.fiat_local_currency || '',
      storeFee: data.store_fee || '0',
      center: data.center || '',
      address: data.address || '',
      status: data.status || '',
      refCode: data.ref_code || '',
      createdAt: data.created_at || '',
    };
  }
}

export default CashStoreTransaction;
