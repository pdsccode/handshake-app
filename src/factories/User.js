export default class UserFactory {
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

  static ccLimit(data) {
    return {
      level: data.level || '',
      limit: data.limit || '',
      duration: data.duration || '',
    };
  }

  static userCcLimit(data) {
    return {
      level: data.level || '',
      limit: data.limit || '',
      amount: data.amount || '',
      endDate: data.end_date || '',
    };
  }

  static userCreditCard(data) {
    return {
      ccNumber: data.cc_number || '',
      expirationDate: data.expiration_date || '',
      token: data.token || '',
    };
  }

  static userProfile(data) {
    return {
      userId: data.user_id || '',
      creditCardStatus: data.credit_card_status || '',
      creditCard: UserFactory.userCreditCard(data.credit_card) || {},
    };
  }

  static ipInfo(data) {
    return {
      ip: data.ip || '',
      city: data.city || '',
      region: data.region || '',
      regionCode: data.region_code || '',
      country: data.country || '',
      countryName: data.country_name || '',
      continentCode: data.continent_code || '',
      inEu: data.in_eu || '',
      postal: data.postal || '',
      latitude: data.latitude || '',
      longitude: data.longitude || '',
      timezone: data.timezone || '',
      utcOffset: data.utc_offset || '',
      countryCallingCode: data.country_calling_code || '',
      currency: data.currency || '',
      languages: data.languages || '',
      asn: data.asn || '',
      org: data.org || '',
      addressDefault: '',
    };
  }
}
