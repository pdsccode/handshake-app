import { call } from 'redux-saga/effects';
import { getBalance, getEstimateGas } from '@/components/handshakes/betting/utils';

export function* isBalanceinInvalid() {
  try {
    const balance = yield call(getBalance, {});
    const estimatedGas = yield call(getEstimateGas, {});
    return estimatedGas > balance ? estimatedGas : false;
  } catch (e) {
    console.error(e);
    return false;
  }
}
