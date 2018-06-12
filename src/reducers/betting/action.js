
import { createAPI } from '@/reducers/action';

export const BETTING_ACTIONS = {
  LOAD_MATCHES: 'LOAD_MATCHES',
  LOAD_HANDSHAKES: 'LOAD_HANDSHAKES',
};

export const loadMatches = createAPI(BETTING_ACTIONS.LOAD_MATCHES);
export const loadHandshakes = createAPI(BETTING_ACTIONS.LOAD_HANDSHAKES);

