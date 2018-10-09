
class BuyCryptoCoinInfo {
  static parseRes(data = {}) {
    return {
      fee: Number.parseFloat(data.fee) || 0,
      feeCod: Number.parseFloat(data.fee_cod) || 0,
      feeLocal: Number.parseFloat(data.fee_local) || 0,
      feeLocalCod: Number.parseFloat(data.fee_local_cod) || 0,
      feePercentage: Number.parseFloat(data.fee_percentage) || 0,
      feePercentageCod: Number.parseFloat(data.fee_percentage_cod) || 0,
      fiatAmount: Number.parseFloat(data.fiat_amount) || 0,
      fiatAmountCod: Number.parseFloat(data.fiat_amount_cod) || 0,
      fiatCurrency: data.fiat_currency,
      fiatLocalAmount: Number.parseFloat(data.fiat_local_amount) || 0,
      fiatLocalAmountCod: Number.parseFloat(data.fiat_local_amount_cod) || 0,
      fiatLocalCurrency: data.fiat_local_currency,
      limit: Number.parseFloat(data.limit) || 0,
    };
  }
}

export default BuyCryptoCoinInfo;
