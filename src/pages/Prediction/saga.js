import { takeLatest, call, select } from 'redux-saga/effects';
import { apiGet } from '@/stores/api-saga';
import { API_URL } from '@/constants';
import { loadMatches, getReportCount } from './action';
import { eventSelector } from './selector';

export function* handleLoadMatches({ cache = true }) {
  try {
    if (cache) {
      const events = yield select(eventSelector);
      if (events && events.length) {
        return events;
      }
    }

    return yield call(apiGet, {
      PATH_URL: API_URL.CRYPTOSIGN.LOAD_MATCHES,
      type: 'LOAD_MATCHES',
      _key: 'events',
      _path: 'prediction',
    });
  } catch (e) {
    return console.error('handleLoadMachesSaga', e);
  }
}

export function* handleCountReport() {
  try {
    return yield call(apiGet, {
      PATH_URL: API_URL.CRYPTOSIGN.COUNT_REPORT,
      type: 'COUNT_REPORT',
      _key: 'countReport',
      _path: 'ui',
    });
  } catch (e) {
    return console.error('handleCountReport', e);
  }
}


export default function* predictionSaga() {
  yield takeLatest(loadMatches().type, handleLoadMatches);
  yield takeLatest(getReportCount().type, handleCountReport);

}
