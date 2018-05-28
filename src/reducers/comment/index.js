import Comment from '@/models/Comment';
import { ACTIONS } from './action';

const handleListPayload = payload => payload.data.items.map(comment => Comment.comment(comment));

const commentReducer = (state = {
  list: [],
  detail: {},
  isFetching: false,
}, action) => {
  switch (action.type) {
    // List
    case ACTIONS.LOAD_COMMENTS:
      return {
        ...state,
        isFetching: true,
      };
    case `${ACTIONS.LOAD_COMMENTS}_SUCCESS`:
      return {
        ...state,
        isFetching: false,
        list: handleListPayload(action.payload),
      };
    case `${ACTIONS.LOAD_COMMENTS}_FAILED`:
      return {
        ...state,
        isFetching: false,
      };
    default:
      return state;
  }
};

export default commentReducer;
