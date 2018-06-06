import { createAPI } from '@/reducers/action';

export const ACTIONS = {
  AUTH_SIGNUP: 'AUTH_SIGNUP',
  AUTH_FETCH: 'AUTH_FETCH',
  AUTH_UPDATE: 'AUTH_UPDATE',
  GET_VERIFY_PHONE_CODE: 'GET_VERIFY_PHONE_CODE',
  VERIFY_PHONE: 'VERIFY_PHONE',
  SUBMIT_PHONE: 'SUBMIT_PHONE',
  VERIFY_EMAIL: 'VERIFY_EMAIL',
  SUBMIT_EMAIL: 'SUBMIT_EMAIL',
};

export const fetchProfile = createAPI(ACTIONS.AUTH_FETCH);
export const signUp = createAPI(ACTIONS.AUTH_SIGNUP);
export const authUpdate = createAPI(ACTIONS.AUTH_UPDATE);
// profile
export const getVerifyPhoneCode = createAPI(ACTIONS.GET_VERIFY_PHONE_CODE);
export const verifyPhone = createAPI(ACTIONS.VERIFY_PHONE);
export const submitPhone = createAPI(ACTIONS.SUBMIT_PHONE);
export const verifyEmail = createAPI(ACTIONS.VERIFY_EMAIL);
export const submitEmail = createAPI(ACTIONS.SUBMIT_EMAIL);

