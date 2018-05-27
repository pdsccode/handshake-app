class UserProfile {
  static userProfile(data) {
    return {
      userId: data.user_id || '',
      creditCardStatus: data.credit_card_status || '',
      creditCard: data.credit_card || {},
    };
  }
}

export default UserProfile;
