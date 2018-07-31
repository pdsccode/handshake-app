import { takeLatest, call, select } from 'redux-saga/effects';
import { apiGet, apiPost } from '@/stores/api-saga';
import { API_URL } from '@/constants';
import { loadReports, addOutcomes } from './action';
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

function* handleAddOutcomesSaga({ eventId, newOutcomeList, ...payload }) {
  try {
    return yield call(apiPost, {
      PATH_URL: `${API_URL.CRYPTOSIGN.ADD_OUTCOME}\\${eventId}`,
      type: 'ADD_OUTCOMES_API',
      data: newOutcomeList,
      ...payload,
    });
  } catch (e) {
    return console.error('handleAddOutcomesSaga', e);
  }
}

export default function* createMarketSaga() {
  yield takeLatest(loadReports().type, handleLoadReportsSaga);
  yield takeLatest(addOutcomes().type, handleAddOutcomesSaga);
}
