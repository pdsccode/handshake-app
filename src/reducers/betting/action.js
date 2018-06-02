
import { createAPI } from '@/reducers/action';

export const BETTING_ACTIONS = {
  LOAD_MATCHES: 'LOAD_MATCHES',
};
export const loadMatches = createAPI(BETTING_ACTIONS.LOAD_MATCHES);

