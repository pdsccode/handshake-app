import { APP } from '@/constants';
import local from '@/services/local-store';
import { UserFactory } from '@/factories';
import { ACTIONS } from './action';

const authReducer = (state = {
  token: local.get(APP.AUTH_TOKEN),
  profile: UserFactory.profile(local.get(APP.AUTH_PROFILE)) || UserFactory.profile({}),
  isLogged: false,
  offline: local.get(APP.OFFLINE_STATUS),
  updatedAt: Date.now(),
}, action) => {
  switch (action.type) {
    case `${ACTIONS.AUTH_SIGNUP}_SUCCESS`:
      local.save(APP.AUTH_TOKEN, action.payload.data.passpharse);
      return { ...state, token: action.payload.data.passpharse, isLogged: true };

    case `${ACTIONS.AUTH_FETCH}_SUCCESS`:
      local.save(APP.AUTH_PROFILE, action.payload.data);
      return {
        ...state, profile: UserFactory.profile(action.payload.data), isLogged: true, updatedAt: Date.now(),
      };

    case `${ACTIONS.AUTH_UPDATE}_SUCCESS`:
      local.save(APP.AUTH_PROFILE, action.payload.data);
      return {
        ...state, profile: UserFactory.profile(action.payload.data), isLogged: true, updatedAt: Date.now(),
      };
    case `${ACTIONS.SET_OFFLINE_STATUS}_SUCCESS`: {
      return { ...state, offline: state.offline ? 0 : 1 };
    }

    default:
      return state;
  }
};

export default authReducer;
