import { createAPI } from '@/reducers/action';
import { API_URL } from '@/constants';

export const PREDICTION_ACTIONS = {
  LOAD_EVENTS_START: 'LOAD_EVENTS_START',
  LOAD_EVENTS: 'LOAD_EVENTS',
  LOAD_HANDSHAKES_START: 'LOAD_HANDSHAKES_START',
  LOAD_HANDSHAKES: 'LOAD_HANDSHAKES',
};

export const parseOutcome = outcome => ({ ...outcome });

export const parseEvent = (event) => {
  const clone = event;
  clone.outcomes.map(outcome => parseOutcome(outcome));
  return clone;
};

export const loadEvents = () => (dispatch) => {
  dispatch(createAPI(PREDICTION_ACTIONS.LOAD_EVENTS)({ PATH_URL: API_URL.CRYPTOSIGN.LOAD_MATCHES }));
  return { type: PREDICTION_ACTIONS.LOAD_EVENTS_START };
};
