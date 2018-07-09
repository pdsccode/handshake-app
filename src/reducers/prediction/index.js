import { PREDICTION_ACTIONS, parseEvent } from './action';

const predictionReducer = (state = {
  events: [],
  eventsUpdatedAt: Date.now(),
  eventsLoaded: false,
}, action) => {
  switch (action.type) {
    case `${PREDICTION_ACTIONS.LOAD_EVENTS}_SUCCESS`:
      return {
        ...state,
        events: action.payload.data.map(event => parseEvent(event)),
        eventsUpdatedAt: Date.now(),
        eventsLoaded: true,
      };
    case `${PREDICTION_ACTIONS.LOAD_EVENTS}_FALIED`:
      return {
        ...state,
        events: [],
        eventsUpdatedAt: Date.now(),
        eventsLoaded: true,
      };
    default:
      return state;
  }
};

export default predictionReducer;
