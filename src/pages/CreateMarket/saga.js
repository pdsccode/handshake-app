import { takeLatest, call, select } from 'redux-saga/effects';
import { apiGet } from '@/stores/api-saga';
import { API_URL } from '@/constants';
import { loadReports } from './action';
import { reportSelector } from './selector';

function* handleLoadReportsSaga({ cache = true }) {
  try {
    if (cache) {
      const events = yield select(reportSelector);
      if (events && events.length) {
        return events;
      }
    }

    return yield call(apiGet, {
      PATH_URL: API_URL.CRYPTOSIGN.LOAD_REPORTS,
      type: 'LOAD_REPORTS',
      _path: 'reports',
    });
  } catch (e) {
    return console.error('handleLoadReportsSaga', e);
  }
}


export default function* createMarketSaga() {
  yield takeLatest(loadReports().type, handleLoadReportsSaga);
}
