import { createAPI } from '@/reducers/action';

export const ACTIONS = {
  LOAD_WITHDRAW: 'LOAD_WITHDRAW',
  COMPLETE_WITHDRAW: 'COMPLETE_WITHDRAW',
};

export const loadWithdrawList = createAPI(ACTIONS.LOAD_WITHDRAW);
export const completeWithdraw = createAPI(ACTIONS.COMPLETE_WITHDRAW);
