/**
 * HandshakeFactory
 */
export default class HandshakeFactory {
  static handshake(data) {
    return {
      id: data.id,
      hid: data.hid || '',
      type: data.type,
      state: data.state,
      status: data.status,
      initUserId: data.init_user_id,
      shakeUserIds: data.shake_user_ids,
      textSearch: data.text_search,
      shakeCount: data.shake_count,
      viewCount: data.view_count,
      commentCount: data.comment_count,
      initAt: data.init_at,
      lastUpdateAt: data.last_update_at,
      extraData: data.extra_data,
      fromAddress: data.from_address || '',
      odds: data.odds || '',
      outComeId: data.outcome_id || '',
      side: data.side || '',
      remainingAmount: data.remaining_amount || '',
      location: data.location,
      result: data.result || '',
      shakers: data.shakers,
      amount: data.amount || '',
      winValue: data.win_value || '',
      offerFeedType: data.offer_feed_type || '',
      offerType: data.offer_type || '',
      bkStatus: data.bk_status || '',
      reviewCount: data.review_count || 0,
      review: data.review || 0,
      freeBet: data.free_bet || 0,
      closingTime: data.closing_time,
      reportTime: data.reporting_time,
      disputeTime: data.disputing_time,
    };
  }

  static match(data) {
    return {
      id: data.id || '',
      awayTeamCode: data.awayTeamCode || '',
      awayTeamFlag: data.awayTeamFlag || '',
      awayTeamName: data.awayTeamName || '',
      date: data.date || '',
      homeTeamCode: data.homeTeamCode || '',
      homeTeamFlag: data.homeTeamFlag || '',
      homeTeamName: data.homeTeamName || '',
      name: data.name || '',
      marketFee: data.market_fee || '',
      outcomes: (() => {
        if (data.outcomes) {
          return data.outcomes.map(item => HandshakeFactory.outcome(item));
        }
        return [];
      })(),
    };
  }

  static outcome(data) {
    return {
      hid: data.hid || '',
      id: data.id || '',
      name: data.name || '',
      public: data.public || 0,
      handshakes: (() => {
        if (data.handshakes) {
          return data.handshakes.map(item => HandshakeFactory.handshake(item));
        }
        return [];
      })(),
    };
  }
}
