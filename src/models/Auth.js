/**
 * @class Auth
 */
class Auth {
  /**
   *
   *
   * @static
   * @param {*} [rawData={}]
   * @memberof Auth
   */
  static profile(rawData = {}) {
    return {
      avatar: rawData.avatar || '',
      cardId: rawData.card_id || -1,
      cardVerified: rawData.card_verified || '',
      dateCreated: rawData.date_created || '',
      dateModified: rawData.date_modified || '',
      email: rawData.email || '',
      fcmToken: rawData.fcm_token || '',
      id: rawData.id || -1,
      name: rawData.name || '',
      phone: rawData.phone || '',
      rewardWalletAddresses: rawData.reward_wallet_addresses || '',
      status: rawData.status || '',
      username: rawData.username || '',
      address: rawData.address || '',
    };
  }
}

export class DatasetAuth {
  static profile(rawData = {}) {
    return {
      address: rawData.address || '',
      city: rawData.city || '',
      code: rawData.code || '',
      country: rawData.country || '',
      credit: rawData.credit || 0,
      email: rawData.email || '',
      eth_address: rawData.eth_address || '',
      eth_balance: rawData.eth_balance || 0,
      eth_private_key: rawData.eth_private_key || '',
      ether_address: rawData.ether_address || '',
      ether_balance: rawData.ether_balance || 0,
      fullname: rawData.fullname || '',
      id: rawData.id || 0,
      phone: rawData.phone || '',
      state_region: rawData.state_region || '',
      token: rawData.token || '',
      type: rawData.type || 0,
    };
  }
}

export default Auth;
