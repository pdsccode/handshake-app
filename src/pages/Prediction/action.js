import { SET_DATA } from '@/stores/data-action';

export const loadMatches = (payload = {}) => {
  return {
    type: 'PREDICTION:LOAD_MATCHES',
    ...payload,
  };
};

export const removeExpiredEvent = (payload = {}) => {
  return {
    type: 'PREDICTION:REMOVE_EXPIRED_EVENT',
    ...payload,
  };
};

export const loadHandShakes = (payload = {}) => {
  return {
    type: 'PREDICTION:LOAD_HANDSHAKES',
    ...payload,
  };
};

export const getReportCount = (payload = {}) => {
  return {
    type: 'PREDICTION:COUNT_REPORT',
    ...payload,
  };
};

export const checkFreeBet = (payload = {}) => {
  return {
    type: 'PREDICTION:CHECK_FREE_AVAILABLE',
    ...payload,
  };
};


export const updateShowedLuckyPool = () => {
  return SET_DATA({
    type: 'PREDICTION:UPDATE_SHOW_LUCKY_POOL',
    _path: 'ui.showedLuckyPool',
    _value: true,
  });
};
