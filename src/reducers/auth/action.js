import { createAPI } from '@/reducers/action';

export const ACTIONS = {
  AUTH_SIGNUP: 'AUTH_SIGNUP',
  LOGGED_SET: 'LOGGED_SET',
};

export const signUp = createAPI(ACTIONS.AUTH_SIGNUP);
export const setLogged = () => ({ type: ACTIONS.LOGGED_SET });
