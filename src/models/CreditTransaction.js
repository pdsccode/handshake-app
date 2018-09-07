class CreditTransaction {
  static creditTransaction(data) {
    return {
      id: data.id || '',
      feedType: data.feed_type || '',
      type: data.type || '',
      amount: data.amount || '',
      currency: data.currency || '',
      percentage: data.percentage || '',
      status: data.status || '',
      subStatus: data.sub_status || '',
      revenue: data.revenue || '',
      information: data.information || {},
    };
  }
}

export default CreditTransaction;
