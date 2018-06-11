/**
 * Google Analytics Helper
 */

let instance = null;
const EVENT_CATEGORY = {
  DISCOVER_BETTING: 'DiscoverBetting',
  CREATE: 'Create',
  ME: 'ME',
};
const EVENT_ACTION = {
  CLICK_CHOOSE_EVENT: 'Click choose an event',
  CLICK_CHOOSE_OUTCOME: 'Click choose an outcome',
  CLICK_CHOOSE_SIDE: 'Click choose a side',
  CLICK_GO_BUTTON: 'Click go button',
  CLICK_COMMENTS_BOX: 'Click comments box',
  CLICK_SHARE_BUTTON: 'Click share button',
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

  /**
   *
   * @param category
   * @param action
   * @param label
   * @param value
   * @param options
   */
  sendGAEvent({category, action, label, value = 0, options = {}}) {
    try {
      ga('send', 'event', category, action, label, value, options);
    } catch (err) {
    }
  }

  /**
   *
   * @param eventName
   */
  clickChooseAnEvent(eventName) {
    this.sendGAEvent({
      category: EVENT_CATEGORY.DISCOVER_BETTING,
      action: EVENT_ACTION.CLICK_CHOOSE_EVENT,
      label: eventName,
    });
  }

  /**
   *
   * @param outcomeName
   */
  clickChooseAnOutcome(outcomeName) {
    this.sendGAEvent({
      category: EVENT_CATEGORY.DISCOVER_BETTING,
      action: EVENT_ACTION.CLICK_CHOOSE_EVENT,
      label: outcomeName,
    });
  }

  /**
   *
   * @param sideName
   */
  clickChooseASide(sideName) {
    this.sendGAEvent({
      category: EVENT_CATEGORY.DISCOVER_BETTING,
      action: EVENT_ACTION.CLICK_CHOOSE_EVENT,
      label: sideName,
    });
  }
}

export default new GoogleAnalyticsService();
