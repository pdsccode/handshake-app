import { ACTIONS } from './action';

// const TAG = 'WithdrawReducer';
const withdrawReducter = (
  state = {
    list: [],
  },
  action,
) => {
  switch (action.type) {
    // List
    case `${ACTIONS.LOAD_WITHDRAW}_SUCCESS`:
      return {
        ...state,
        list: action?.payload?.data || [],
      };
    case `${ACTIONS.COMPLETE_WITHDRAW}_SUCCESS`:
      return {
        ...state,
      };
    default:
      return state;
  }
};

export default withdrawReducter;

