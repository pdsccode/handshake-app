/**
 * Google Analytics Helper
 */

const TAG = 'GOOGLE_ANALYTIC';

let instance = null;
const EVENT_CATEGORY = {
  PREDICTION: 'Prediction',
  ORDER_BOOK: 'OrderBook',
  ME: 'Me/Prediction',
};
const EVENT_ACTION = {
  //PREDICTION
  CLICK_CHOOSE_OUTCOME: 'Click choose an outcome',
  CLICK_BANNER: 'Click banner',
  CLICK_COMMENT: 'Click comments',

  //ORDER BOOK
  CLICK_SUPPORT: 'Click support',
  CLICK_OPPOSE: 'Click oppose',
  CLICK_SIMPLE: 'Click simple',
  CLICK_ADVANCE: 'Click advance',
  CLICK_PLACE_SUPPORT_ORDER: 'Click place support order',
  CLICK_PLACE_OPPOSE_ORDER: 'Click place oppose order',
  CLICK_FREE_BET: 'Click free bet',
  CLICK_PAID_BET: 'Click paid bet',
  CLICK_CLOSE: 'Click close',

  //ME PREDICTION
  CLICK_ME_CANCEL_BUTTON: 'Click me cancel button',
  CLICK_ME_WITHDRAW_BUTTON: 'Click me withdraw button',
  CLICK_ME_REFUND_BUTTON: 'Click me refund button',

  CLICK_GO_BUTTON: 'Click go button',
  CLICK_COMMENTS_BOX: 'Click comments box',
  CLICK_SHARE_BUTTON: 'Click share button',
  CREATE_BET_SUCCESSFUL: 'Create bet successful',
  CANT_CREATE_BET: `Can't create bet`,
  CREATE_SHARE_BUTTON: 'Create share button',
  CREATE_BET_NOT_MATCH_FAIL: 'Create bet not match - fail',
  CREATE_BET_NOT_MATCH_SUCCESS: 'Create bet not match - success',
  CREATE_BET_MATCHED_FAIL: 'Create bet matched - fail',
  CREATE_BET_MATCHED_SUCCESS: 'Create bet matched - success',
};

const BETTING_SIDE_NAME = {
  1: 'Support',
  2: 'Oppose',
};

class GoogleAnalyticsService {
  /**
   * Creates an instance of GoogleAnalyticsService.
   * @memberof GoogleAnalyticsService
   */
  constructor() {
    if (!instance) {
      instance = this;
    }
    return instance;
  }

  get eventCategory() {
    try {
      const pathName = window.location.pathname;
      const categoryByPathName = {
        '/prediction': EVENT_CATEGORY.PREDICTION,
        '/orderbook': EVENT_CATEGORY.ORDER_BOOK,
        '/me/prediction': EVENT_CATEGORY.ME,
      };
      return categoryByPathName[pathName];
    } catch (err) {
      return '';
    }
  }

  /**
   *
   * @param category
   * @param action
   * @param label
   * @param value
   * @param options
   */
  sendGAEvent({
    category, action, label, value = 0, options = {},
  }) {
    try {
      ga('send', 'event', category, action, label, value, options);
    } catch (err) {
    }
  }

  //PREDICTION
  /**
   *
   * @param outcomeName
   */

  clickChooseAnOutcome(eventName, outcomeName) {
    const params = {
      category: EVENT_CATEGORY.PREDICTION,
      action: EVENT_ACTION.CLICK_CHOOSE_OUTCOME,
      label: `${eventName}-${outcomeName}`,
    };

    console.log(TAG, 'clickChooseAnOutcome', params);
    this.sendGAEvent(params);
  }

  /**
   *
   *
   */
  clickBannerWin() {
    const params = {
      category: EVENT_CATEGORY.PREDICTION,
      action: EVENT_ACTION.CLICK_BANNER,
    };
    console.log(TAG, 'clickBannerWin', params);

    this.sendGAEvent(params);
  }

  /**
   *
   *
   */
  clickComment(eventName) {
    const params = {
      category: EVENT_CATEGORY.PREDICTION,
      action: EVENT_ACTION.CLICK_COMMENT,
      label: `${eventName}`,
    };
    console.log(TAG, 'clickComment', params);

    this.sendGAEvent(params);
  }

  //ORDER BOOK
  /**
   *
   */
  clickSupport(outcome) {
    const params = {
      category: EVENT_CATEGORY.ORDER_BOOK,
      action: EVENT_ACTION.CLICK_SUPPORT,
      label: `${outcome}`,
    };
    console.log(TAG, 'clickSupport', params);

    this.sendGAEvent(params);
  }

  /**
   *
   */
  clickOppose(outcome) {
    const params = {
      category: EVENT_CATEGORY.ORDER_BOOK,
      action: EVENT_ACTION.CLICK_OPPOSE,
      label: `${outcome}`,
    };
    console.log(TAG, 'clickOppose', params);

    this.sendGAEvent(params);
  }

  /**
   *
   */
  clickSimple(outcome) {
    const params = {
      category: EVENT_CATEGORY.ORDER_BOOK,
      action: EVENT_ACTION.CLICK_SIMPLE,
      label: `${outcome}`,
    };
    console.log(TAG, 'clickSimple', params);

    this.sendGAEvent(params);
  }
  /**
   *
   */
  clickAdvance(outcome) {
    const params = {
      category: EVENT_CATEGORY.ORDER_BOOK,
      action: EVENT_ACTION.CLICK_ADVANCE,
      label: `${outcome}`,
    };
    console.log(TAG, 'clickAdvance', params);

    this.sendGAEvent(params);
  }

  /**
   *
   */
  clickPlaceSupportOrder(outcome) {
    const params = {
      category: EVENT_CATEGORY.ORDER_BOOK,
      action: EVENT_ACTION.CLICK_PLACE_SUPPORT_ORDER,
      label: `${outcome}`,
    };
    console.log(TAG, 'clickPlaceSupportOrder', params);

    this.sendGAEvent(params);
  }

  /**
   *
   */
  clickPlaceOpposeOrder(outcome) {
    const params = {
      category: EVENT_CATEGORY.ORDER_BOOK,
      action: EVENT_ACTION.CLICK_PLACE_OPPOSE_ORDER,
      label: `${outcome}`,
    };
    console.log(TAG, 'clickPlaceOpposeOrder', params);

    this.sendGAEvent(params);
  }

  /**
   *
   */
  clickPlaceOpposeOrder(outcome) {
    const params = {
      category: EVENT_CATEGORY.ORDER_BOOK,
      action: EVENT_ACTION.CLICK_PLACE_OPPOSE_ORDER,
      label: `${outcome}`,
    };
    console.log(TAG, 'clickPlaceOpposeOrder', params);

    this.sendGAEvent(params);
  }

  /**
   *
   */
  clickFree(outcome) {
    const params = {
      category: EVENT_CATEGORY.ORDER_BOOK,
      action: EVENT_ACTION.CLICK_FREE_BET,
      label: `${outcome}`,
    };
    console.log(TAG, 'clickFree', params);

    this.sendGAEvent(params);
  }

  /**
   *
   */
  clickPaid(outcome) {
    const params = {
      category: EVENT_CATEGORY.ORDER_BOOK,
      action: EVENT_ACTION.CLICK_PAID_BET,
      label: `${outcome}`,
    };
    console.log(TAG, 'clickPaid', params);

    this.sendGAEvent(params);
  }

  /**
   *
   */
  clickClose(outcome) {
    const params = {
      category: EVENT_CATEGORY.ORDER_BOOK,
      action: EVENT_ACTION.CLICK_CLOSE,
      label: `${outcome}`,
    };
    console.log(TAG, 'clickClose', params);

    this.sendGAEvent(params);
  }


  /**
   *
   * @param matchName
   * @param matchOutCome
   * @param sideName
   */
  createBetSuccess(matchName, matchOutCome, sideName) {
    const params = {
      category: EVENT_CATEGORY.ORDER_BOOK,
      action: EVENT_ACTION.CREATE_BET_SUCCESSFUL,
      label: `${sideName === 1 ? 'Support' : 'Oppose'}: ${matchName} - ${matchOutCome}`,
    };
    console.log(TAG, 'createBetSuccess', params);
    try {
      this.sendGAEvent(params);
    } catch (err) {}
  }

  /**
   *
   */
  createBetNotSuccess(errMessage) {
    const params = {
      category: EVENT_CATEGORY.ORDER_BOOK,
      action: EVENT_ACTION.CANT_CREATE_BET,
      label: errMessage,
    };
    console.log(TAG, 'createBetNotSuccess', params);
    try {
      this.sendGAEvent(params);
    } catch (err) {}
  }


  /** z
   *
   * @param side
   * @param odds
   * @param amount
   */
  createBetNotMatchSuccess({ side, odds, amount, txHash }) {
    const params = {
      category: EVENT_CATEGORY.ORDER_BOOK,
      action: EVENT_ACTION.CREATE_BET_NOT_MATCH_SUCCESS,
      label: `${BETTING_SIDE_NAME[side]} - Odds: ${odds} - Amount: ${amount}-${txHash}`,
    };
    console.log(TAG, 'createBetNotMatchSuccess', params);

    try {
      const category = this.eventCategory;
      if (category) {
        this.sendGAEvent(params);
      }
    } catch (err) {}
  }


  /**
   *
   * @param side
   * @param odds
   * @param amount
   */
  createBetMatchedSuccess({ side, odds, amount, txHash }) {
    const params = {
      category: EVENT_CATEGORY.ORDER_BOOK,
      action: EVENT_ACTION.CREATE_BET_MATCHED_SUCCESS,
      label: `${BETTING_SIDE_NAME[side]} - Odds: ${odds} - Amount: ${amount}-${txHash}`,
    };
    console.log(TAG, 'createBetMatchedSuccess', params);
    try {
      this.sendGAEvent(params);
    } catch (err) {
      console.log(TAG, err);
    }
  }

  /**
   *
   * @param event
   * @param outcome
   */
  createClickCancel(event, outcome, txHash) {
    const params = {
      category: EVENT_CATEGORY.ME,
      action: EVENT_ACTION.CLICK_ME_CANCEL_BUTTON,
      label: `${outcome})-${txHash}`,
    };
    console.log(TAG, 'createClickCancel', params);
    try {
      this.sendGAEvent(params);
    } catch (err) {}
  }
  /**
   *
   * @param event
   * @param outcome
   */
  createClickWithdraw(event, outcome, txHash) {
    const params = {
      category: EVENT_CATEGORY.ME,
      action: EVENT_ACTION.CLICK_ME_WITHDRAW_BUTTON,
      label: `${outcome})-${txHash}`,
    };
    console.log(TAG, 'createClickWithdraw', params);

    try {
      this.sendGAEvent(params);
    } catch (err) {}
  }
  /**
   *
   * @param event
   * @param outcome
   */
  createClickRefund(event, outcome, txHash) {
    const params = {
      category: EVENT_CATEGORY.ME,
      action: EVENT_ACTION.CLICK_ME_WITHDRAW_BUTTON,
      label: `${outcome})-${txHash}`,
    };
    console.log(TAG, 'createClickRefund', params);

    try {
      this.sendGAEvent(params);
    } catch (err) {}
  }
}

export default new GoogleAnalyticsService();
