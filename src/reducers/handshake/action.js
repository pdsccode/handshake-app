import { BASE_API } from '@/constants';
import { createAPI } from '@/reducers/action';

export const ACTIONS = {
  // HANDSHAKE
  INIT_HANDSHAKE: 'INIT_HANDSHAKE',
  SHAKE: 'SHAKE',
  UNINIT: 'UNINIT',
  COLLECT: 'COLLECT',
  REFUND: 'REFUND',
  ROLLBACK: 'ROLLBACK'
};

export const initHandshake = createAPI(ACTIONS.INIT_HANDSHAKE);
export const shakeItem = createAPI(ACTIONS.SHAKE);
export const uninitItem = createAPI(ACTIONS.UNINIT);
export const collect = createAPI(ACTIONS.COLLECT);
export const refund = createAPI(ACTIONS.REFUND);
export const rollback = createAPI(ACTIONS.ROLLBACK);



