class DashboardItem {
  static dashboardItem(data) {
    return {
      currency: data.currency || '',
      success: data.success || 0,
      failed: data.failed || 0,
      pending: data.pending || 0,
      buyAmount: data.buy_amount || 0,
      sellAmount: data.sell_amount || 0,
      buyFiatAmounts: data.buy_fiat_amounts || {},
      sellFiatAmounts: data.sell_fiat_amounts || {},
    };
  }
}

export default DashboardItem;
