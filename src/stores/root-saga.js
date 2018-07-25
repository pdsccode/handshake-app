import { spawn } from 'redux-saga/effects';
import predictionSaga from '@/pages/Prediction/saga';

export default function* rootSaga() {
  yield spawn(predictionSaga);
}
