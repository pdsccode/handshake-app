import { ACTIONS } from './action';

const historyReducter = (
  state = {
    data: {},
    isFetching: false,
  },
  action,
) => {
  switch (action.type) {
    case `${ACTIONS.LOAD_DATASET_HISTORY}_SUCCESS`:
      return {
        ...state,
        data: action.payload || {},
        isFetching: false,
      };
    default:
      return state;
  }
};

export default historyReducter;
