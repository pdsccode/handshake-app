import { ADMIN_ACTIONS } from './action';

const adminReducter = (state = {
  login: false,
}, action) => {
  switch (action.type) {
    case ADMIN_ACTIONS.AUTH:
      return {
        ...state,
        isFetching: true,
      };
    case `${ADMIN_ACTIONS.AUTH}_SUCCESS`:
      return {
        ...state,
        isFetching: false,
        login: action.payload.data.access_token ? true : false,
      };
    default:
      return state;
  }
};
export default adminReducter;

