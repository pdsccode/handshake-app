import { uniqBy, reverse, sortBy } from 'lodash';
import { ACTIONS } from './action';

// const TAG = 'InternalWithdrawReducer';
const internalAdminReducter = (
  state = {
    orderList: [],
    page: null,
  },
  action,
) => {
  switch (action.type) {
    case `${ACTIONS.LOAD_INTERNAL_ADMIN_CASH_ORDER}_SUCCESS`:
      if (action?.payload?.data) {
        let newList = [...state?.orderList, ...action?.payload?.data];
        newList = uniqBy(newList, item => item.id);
        // newList = reverse(sortBy(newList, ['status', 'created_at']));
        const page = action?.payload?.can_move ? action?.payload?.page : null;
        return {
          ...state,
          orderList: newList,
          page,
        };
      }
      return state;
    // case `${ACTIONS.COMPLETE_INTERNAL_WITHDRAW}_SUCCESS`:
    //   if (action?.payload?.data) {
    //     const payloadData = action?.payload?.data || {};
    //     const foundIndex = state?.list?.findIndex(item => item.id === payloadData.id);
    //     const newList = [...state.list];
    //     if (foundIndex !== -1) {
    //       newList[foundIndex] = payloadData;
    //     }
    //     return {
    //       ...state,
    //       list: newList,
    //     };
    //   }
    //   return state;
    default:
      return state;
  }
};

export default internalAdminReducter;

