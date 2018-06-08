class CoinOffer {
  static coinOffer(data) {
    return {
      currency: data.currency || '',
      sellAmount: data.sell_amount || '',
      sellPercentage: data.sell_percentage || '',
      buyAmount: data.buy_amount || '',
      buyPercentage: data.buy_percentage || '',
      userAddress: data.user_address || '',
      rewardAddress: data.reward_address || '',
    };
  }
}

export default CoinOffer;
