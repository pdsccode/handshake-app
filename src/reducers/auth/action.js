import { createAPI } from '@/reducers/action';

export const ACTIONS = {
  AUTH_SIGNUP: 'AUTH_SIGNUP',
  AUTH_FETCH: 'AUTH_FETCH',
  AUTH_UPDATE: 'AUTH_UPDATE',
};

export const fetchProfile = createAPI(ACTIONS.AUTH_FETCH);
export const signUp = createAPI(ACTIONS.AUTH_SIGNUP);
export const authUpdate = createAPI(ACTIONS.AUTH_UPDATE);
