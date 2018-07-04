/**
 * ExchangeFactory
 */
export default class ExchangeFactory {
  static coinOffer(data) {
    return {
      currency: data.currency || '',
      status: data.status || '',
      sellAmountMin: data.sell_amount_min || '',
      sellAmount: data.sell_amount || '',
      sellTotalAmount: data.sell_total_amount || '',
      sellBalance: data.sell_balance || '',
      sellPercentage: data.sell_percentage || '',
      buyAmountMin: data.buy_amount_min || '',
      buyAmount: data.buy_amount || '',
      buyBalance: data.buy_balance || '',
      buyPercentage: data.buy_percentage || '',
      systemAddress: data.system_address || '',
      userAddress: data.user_address || '',
      rewardAddress: data.reward_address || '',
      freeStart: data.free_start || false,
    };
  }

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
      email: data.email || '',
      feePercentage: data.fee_percentage || '',
      toEmail: data.to_email || '',
      toContactPhone: data.to_contact_phone || '',
      toContactInfo: data.to_contact_info || '',
      offChainId: data.off_chain_id || '',
      hid: data.hid || '',
      chatUsername: data.chat_username || '',
      toChatUsername: data.to_chat_username || '',
      physicalItem: data.physical_item || '',


      // Offer store
      sellAmountMin: data.sell_amount_min || '',
      sellAmount: data.sell_amount || '',
      sellBalance: data.sell_balance || '',
      sellPercentage: data.sell_percentage || '',
      buyAmountMin: data.buy_amount_min || '',
      buyAmount: data.buy_amount || '',
      buyBalance: data.buy_balance || '',
      buyPercentage: data.buy_percentage || '',
      rewardAddress: data.reward_address || '',
      freeStart: data.free_start || false,
    };
  }

  static offerPrice(data) {
    return {
      type: data.Type || '',
      amount: data.Amount || '',
      currency: data.Currency || '',
      fiatCurrency: data.FiatCurrency || '',
      fiatAmount: data.FiatAmount || '',
      price: data.Price || '',
    };
  }

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
      items: (() => {
        if (data.items) {
          return {
            BTC: data.items.BTC ? ExchangeFactory.coinOffer(data.items.BTC) : {},
            ETH: data.items.ETH ? ExchangeFactory.coinOffer(data.items.ETH) : {},
          };
        }
        return {};
      })(),
      chatUsername: data.chat_username || '',
      toChatUsername: data.to_chat_username || '',
    };
  }
}
