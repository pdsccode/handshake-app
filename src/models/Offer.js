class Offer {
  static offer(data) {
    return {
      id: data.id || '',
      amount: data.amount || '',
      totalAmount: data.total_amount || '',
      currency: data.currency || '',
      price: data.price || '',
      fiatAmount: data.fiat_amount || '',
      fiatCurrency: data.fiat_currency || '',
      type: data.type || '',
      status: data.status || '',
      uid: data.uid || '',
      username: data.username || '',
      toUid: data.to_uid || '',
      toUsername: data.to_username || '',
      contactInfo: data.contact_info || '',
      systemAddress: data.system_address || '',
      userAddress: data.user_address || '',
      provider: data.provider || '',
      providerData: data.provider_data || '',
      createdAt: data.created_at || '',
      updatedAt: data.updated_at || '',

      contactPhone: data.contact_phone || '',
      percentage: data.percentage || '',
      success: data.success || 0,
      failed: data.failed || 0,
      feedType: data.feed_type || '',
    };
  }
}

export default Offer;
