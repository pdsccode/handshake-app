import { BASE_API } from '@/config';
import { createAPI } from '@/reducers/action';

export const ACTIONS = {
  // HANDSHAKE
  INIT_HANDSHAKE: 'INIT_HANDSHAKE',
  SHAKE: 'SHAKE',
};

export const initHandshake = createAPI(ACTIONS.INIT_HANDSHAKE);
export const shakeItem = createAPI(ACTIONS.SHAKE);
