import { takeLatest, call } from 'redux-saga/effects';
import { apiGet } from '@/stores/api-saga';
import { API_URL } from '@/constants';
import { loadMatches } from './action';

function* handleLoadMachesSaga() {
  const data = yield call(apiGet, {
    PATH_URL: API_URL.CRYPTOSIGN.LOAD_MATCHES,
    type: 'LOAD_MATCHES',
    _key: 'events',
    _path: 'prediction',
  });
}


export default function* predictionSaga() {
  yield takeLatest(loadMatches().type, handleLoadMachesSaga);
}
