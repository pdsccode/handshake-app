class OfferShop {
  static offerShop(data) {
    return {
      id: data.id || '',
      hid: data.hid || '',
      itemFlags: data.item_flags || '',
      status: data.status || '',
      email: data.email || '',
      username: data.username || '',
      contactPhone: data.contact_phone || '',
      contactInfo: data.contact_info || '',
      latitude: data.latitude || '',
      longitude: data.longitude || '',
      fiatCurrency: data.fiat_currency || '',
      transactionCount: data.transaction_count || {},
    };
  }
}

export default OfferShop;
