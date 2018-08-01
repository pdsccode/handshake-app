import { SET_DATA } from '@/stores/data-action';

export const updateEmail = (value) => {
  return SET_DATA({
    type: 'CREATE_MARKET:UPDATE_EMAIL',
    _path: 'auth.profile.email',
    _value: value,
  });
};

export const updateCreateEventLoading = (value) => {
  return SET_DATA({
    type: 'CREATE_MARKET:LOADING',
    _path: 'ui.isCreateEventLoading',
    _value: value,
  });
}

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
}

