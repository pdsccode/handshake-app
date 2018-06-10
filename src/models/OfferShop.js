import CoinOffer from "./CoinOffer";

class OfferShop {
  static offerShop(data) {
    return {
      id: data.id || '',
      hid: data.hid || '',
      itemFlags: data.item_flags || {},
      status: data.status || '',
      username: data.username || '',
      email: data.email || '',
      language: data.language || '',
      contactPhone: data.contact_phone || '',
      contactInfo: data.contact_info || '',
      longitude: data.longitude || '',
      latitude: data.latitude || '',
      fiatCurrency: data.fiat_currency || '',
      transactionCount: data.transaction_count || {},
      createdAt: data.created_at || '',
      updatedAt: data.updated_at || '',
      itemSnapshots: data.item_snapshots ? {
        BTC: CoinOffer.coinOffer(data.item_snapshots.BTC),
        ETH: CoinOffer.coinOffer(data.item_snapshots.ETH),
      } : {},
    };
  }
}

export default OfferShop;
