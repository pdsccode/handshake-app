import { AUTH_ACTIONS } from './action';
import localStore from '@/services/localStore';

function authReducter(state = { isSigning: false }, action) {
  switch (action.type) {
    // auth
    case AUTH_ACTIONS.SIGN_IN:
      return {
        ...state,
        isSigning: true,
      };

    case AUTH_ACTIONS.SIGN_IN_SUCCESS:
      localStore.save(action.kind, action.payload);
      let signIn = {
        ...state,
        isSigning: false,
      };
      signIn[action.kind] = {
        isSigned: true,
        account: action.payload,
      };
      return signIn;

    case AUTH_ACTIONS.SIGN_IN_FAILED:
      let signInFailed = {
        ...state,
        isSigning: false,
      };
      signInFailed[action.kind] = {
        isSigned: false,
        account: {},
      };
      return signInFailed;

    case AUTH_ACTIONS.SIGN_OUT_SUCCESS:
      localStore.remove(action.kind);
      let signOut = {
        ...state,
        isSigning: false,
      };
      signOut[action.kind] = {
        isSigned: false,
        account: {},
      };
      return signOut;

    case AUTH_ACTIONS.SIGN_UP_SUCCESS:
      localStore.save(action.kind, action.payload);
      let signUp = {
        ...state,
        isSigning: false,
      };
      signUp[action.kind] = {
        isSigned: true,
        account: action.payload,
      };
      return signUp;

    default:
      return state;
  }
}

export default authReducter;
