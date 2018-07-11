import { APP } from '@/constants';
import local from '@/services/localStore';
import Auth, { DatasetAuth } from '@/models/Auth';
import { ACTIONS } from './action';

const authReducter = (
  state = {
    token: local.get(APP.AUTH_TOKEN),
    profile: Auth.profile(local.get(APP.AUTH_PROFILE)) || Auth.profile({}),
    dataset_profile:
      DatasetAuth.profile(local.get(APP.DATASET_AUTH_PROFILE)) ||
      DatasetAuth.profile({}),
    isLogged: false,
    offline: local.get(APP.OFFLINE_STATUS),
    updatedAt: Date.now(),
  },
  action,
) => {
  switch (action.type) {
    case `${ACTIONS.AUTH_SIGNUP}_SUCCESS`:
      local.save(APP.AUTH_TOKEN, action.payload.data.passpharse);
      return {
        ...state,
        token: action.payload.data.passpharse,
        isLogged: true,
      };

    case `${ACTIONS.AUTH_FETCH}_SUCCESS`:
      local.save(APP.AUTH_PROFILE, action.payload.data);
      return {
        ...state,
        profile: Auth.profile(action.payload.data),
        isLogged: true,
        updatedAt: Date.now(),
      };

    case `${ACTIONS.AUTH_UPDATE}_SUCCESS`:
      local.save(APP.AUTH_PROFILE, action.payload.data);
      return {
        ...state,
        profile: Auth.profile(action.payload.data),
        isLogged: true,
        updatedAt: Date.now(),
      };
    case `${ACTIONS.SET_OFFLINE_STATUS}_SUCCESS`: {
      return { ...state, offline: state.offline ? 0 : 1 };
    }
    case `${ACTIONS.DATASET_AUTH_SIGNUP}_SUCCESS`:
      console.log(
        'HIENTON authReducter DATASET_AUTH_SIGNUP_SUCCESS  = ',
        action.payload,
      );
      local.save(APP.DATASET_AUTH_PROFILE, action.payload);
      return {
        ...state,
        dataset_profile: DatasetAuth.profile(action.payload),
      };

    default:
      return state;
  }
};

export default authReducter;
