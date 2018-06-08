class OfferShop {
  static offerShop(data) {
    return {
      email: data.email || '',
      username: data.username || '',
      contactPhone: data.contact_phone || '',
      contactInfo: data.contact_info || '',
      latitude: data.latitude || '',
      longitude: data.longitude || '',
      fiatCurrency: data.fiat_currency ||,
    };
  }
}

export default OfferShop;
