import { APP } from '@/constants';
import local from '@/services/localStore';
import { ACTIONS } from './action';

const authReducter = (state = {
  isLogged: false,
}, action) => {
  switch (action.type) {
    case `${ACTIONS.AUTH_SIGNUP}_SUCCESS`:
      local.save(APP.TOKEN, action.payload.data.passpharse);
      return { ...state, isLogged: true };

    case ACTIONS.LOGGED_SET:
      return { ...state, isLogged: true };
    default:
      return state;
  }
};

export default authReducter;
