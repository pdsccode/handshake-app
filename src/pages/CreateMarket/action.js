import { SET_DATA } from '@/stores/data-action';

export const updateEmailToStore = (value) => {
  return SET_DATA({
    type: 'CREATE_MARKET:UPDATE_EMAIL_TO_STORE',
    _path: 'auth.profile.email',
    _value: value,
  });
};

export const updateEmail = (payload = {}) => {
  return {
    type: 'CREATE_MARKET:UPDATE_EMAIL',
    ...payload,
  };
};

export const updateCreateEventLoading = (value) => {
  return SET_DATA({
    type: 'CREATE_MARKET:LOADING',
    _path: 'ui.isCreateEventLoading',
    _value: value,
  });
};

export const shareEvent = (value) => {
  return SET_DATA({
    type: 'CREATE_MARKET:SHARE_EVENT',
    _path: 'ui.shareEvent',
    _value: value,
  });
};

export const loadCreateEventData = (payload = {}) => {
  return {
    type: 'CREATE_MARKET:HANDLE_CREATE_EVENT_DATA',
    ...payload,
  };
};

export const generateShareLink = (payload = {}) => {
  return {
    type: 'CREATE_MARKET:GENERATE_SHARE_LINK',
    ...payload,
  };
};

export const createEvent = (payload = {}) => {
  return {
    type: 'CREATE_MARKET:CREATE_EVENT',
    ...payload,
  };
};

