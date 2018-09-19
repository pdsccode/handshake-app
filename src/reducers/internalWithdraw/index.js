import { uniqBy } from 'lodash';
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
      if (action?.payload?.data) {
        const newList = [...state?.list, ...action?.payload?.data];
        uniqBy(newList, item => item.id);
        return {
          ...state,
          list: newList,
        };
      }
      return state;
    case `${ACTIONS.COMPLETE_INTERNAL_WITHDRAW}_SUCCESS`:
      if (action?.payload?.data) {
        const payloadData = action?.payload?.data || {};
        const foundIndex = state?.list?.findIndex(item => item.id === payloadData.id);
        const newList = [...state.list];
        if (foundIndex !== -1) {
          newList[foundIndex] = payloadData;
        }
        return {
          ...state,
          list: newList,
        };
      }
      return state;
    default:
      return state;
  }
};

export default internalWithdrawReducter;

