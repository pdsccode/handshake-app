class Handshake {
  static handshake(data) {
    return {
      id: data.id,
      hid: data.hid,
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
      hid: data.hid || '',
      fromAddress: data.from_address || '',
      odds: data.odds || '',
      outComeId: data.outcome_id || '',
      side: data.side || '',
      remainingAmount: data.remaining_amount || '',
      location: data.location,
    };
  }
}

export default Handshake;
