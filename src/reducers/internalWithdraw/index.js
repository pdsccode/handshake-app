import { ACTIONS } from './action';

// const TAG = 'InternalWithdrawReducer';
const internalWithdrawReducter = (
  state = {
    list: [],
  },
  action,
) => {
  switch (action.type) {
    case `${ACTIONS.LOAD_INTERNAL_WITHDRAW}_SUCCESS`:
      return {
        ...state,
        list: action?.payload?.data || [],
      };
    case `${ACTIONS.COMPLETE_INTERNAL_WITHDRAW}_SUCCESS`:
      // TODO: maybe do something else later
      return {
        ...state,
      };
    default:
      return state;
  }
};

export default internalWithdrawReducter;

