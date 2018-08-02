import { takeLatest, call, put, select } from 'redux-saga/effects';
import { apiGet, apiPost } from '@/stores/api-saga';
import { API_URL } from '@/constants';
import { BetHandshakeHandler } from '@/components/handshakes/betting/Feed/BetHandshakeHandler';
import { handleLoadMatches } from '@/pages/Prediction/saga';
import { loadCreateEventData, createEvent, shareEvent, getUserProfile, updateEmail, updateEmailToStore } from './action';
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

function* handleLoadCreateEventData() {
  try {
    yield call(handleLoadReportsSaga, {});
    yield call(handleLoadMatches, {});
  } catch (e) {
    console.error(e);
  }
}

function* handleAddOutcomesSaga({ eventId, newOutcomeList, ...payload }) {
  try {
    return yield call(apiPost, {
      PATH_URL: `${API_URL.CRYPTOSIGN.ADD_OUTCOME}\\${eventId}`,
      type: 'ADD_OUTCOMES_API', // @TODO: review name
      data: newOutcomeList,
      ...payload,
    });
  } catch (e) {
    return console.error('handleAddOutcomesSaga', e);
  }
}

function* handleCreateNewEventSaga({ newEventData }) {
  try {
    return yield call(apiPost, {
      PATH_URL: `${API_URL.CRYPTOSIGN.ADD_MATCH}`,
      type: 'ADD_EVENT_API',
      data: [newEventData],
    });
  } catch (e) {
    return console.error(e);
  }
}

function* handleGenerateShareLinkSaga({ outcomeId, ...payload }) {
  try {
    return yield call(apiPost, {
      PATH_URL: `${API_URL.CRYPTOSIGN.GENERATE_LINK}`,
      type: 'GENERATE_SHARE_LINK',
      data: {
        outcome_id: outcomeId,
      },
      ...payload,
    });
  } catch (e) {
    return console.error('handleGenerateShareLinkSaga', e);
  }
}

function* saveGenerateShareLinkToStore(data) {
  const { outcomeId, eventName } = data;
  const generateLink = yield call(handleGenerateShareLinkSaga, { outcomeId });
  return yield put(shareEvent({
    url: `${window.location.origin}/${generateLink.data.slug_short}`,
    name: eventName,
  }));
}

function* handleCreateEventSaga({ values, isNew, selectedSource }) {
  try {
    if (!isNew) {
      // Add new outcomes
      const newOutcomeList = values.outcomes.filter(o => !o.id).map(i => Object.assign({}, i, { public: 0 }));
      const addOutcomeResult = yield call(handleAddOutcomesSaga, {
        eventId: values.eventId,
        newOutcomeList,
      });
      if (!addOutcomeResult.error) {
        const outcomeId = addOutcomeResult.data[0].id;
        const eventName = addOutcomeResult.data[0].name;
        yield saveGenerateShareLinkToStore({ outcomeId, eventName });
      }
    } else {
      const reportSource = {
        source_id: selectedSource,
        source: selectedSource ? undefined : {
          name: values.ownReportName,
          url: values.ownReportUrl,
        },
      };
      Object.keys(reportSource).forEach((k) => !reportSource[k] && delete reportSource[k]);
      const newEventData = {
        homeTeamName: values.homeTeamName || '',
        awayTeamName: values.awayTeamName || '',
        homeTeamCode: values.homeTeamCode || '',
        awayTeamCode: values.awayTeamCode || '',
        homeTeamFlag: values.homeTeamFlag || '',
        awayTeamFlag: values.awayTeamFlag || '',
        name: values.eventName,
        date: values.closingTime,
        reportTime: values.reportingTime,
        disputeTime: values.disputeTime,
        market_fee: values.creatorFee,
        outcomes: values.outcomes,
        ...reportSource,
      };
      const betHandshakeHandler = BetHandshakeHandler.getShareManager();
      const { data } = yield call(handleCreateNewEventSaga, { newEventData });
      if (data && data.length) {
        const eventData = data[0];
        const inputData = eventData.outcomes.map(o => {
          return {
            fee: eventData.market_fee,
            source: eventData.source_name,
            closingTime: eventData.date,
            reportTime: eventData.reportTime,
            disputeTime: eventData.disputeTime,
            offchain: o.id,
          };
        });
        const outcomeId = eventData.outcomes[0].id;
        const eventName = eventData.name;
        yield saveGenerateShareLinkToStore({ outcomeId, eventName });
        console.log('inputData', inputData);
        betHandshakeHandler.createNewEvent(inputData);
      }
    }
  } catch (e) {
    return console.error('handleCreateNewEventSaga', e);
  }
}

function* handleGetUserProfileSaga() {
  try {
    return yield call(apiGet, {
      PATH_URL: API_URL.USER.PROFILE,
      type: 'GET_USER_PROFILE',
      _key: 'profile',
      _path: 'user',
    });
  } catch (e) {
    return console.error('handleGetUserProfile', e);
  }
}

function* handleUpdateEmail({ newEmail, ...payload }) {
  try {
    const userProfile = new FormData();
    userProfile.set('email', newEmail.email);
    const responded = yield call(apiPost, {
      PATH_URL: API_URL.USER.PROFILE,
      type: 'UPDATE_EMAIL',
      data: userProfile,
      headers: { 'Content-Type': 'multipart/form-data' },
      ...payload,
    });
    return yield put(updateEmailToStore(responded.data.email));
  } catch (e) {
    return console.error('handleUpdateEmail', e);
  }
}

export default function* createMarketSaga() {
  yield takeLatest(loadCreateEventData().type, handleLoadCreateEventData);
  yield takeLatest(createEvent().type, handleCreateEventSaga);
  yield takeLatest(getUserProfile().type, handleGetUserProfileSaga);
  yield takeLatest(updateEmail().type, handleUpdateEmail);
}
