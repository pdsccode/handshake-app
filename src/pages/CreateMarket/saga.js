import { takeLatest, call, put, select, all } from 'redux-saga/effects';
import { apiGet, apiPost } from '@/stores/api-saga';
import { API_URL, URL } from '@/constants';
import { BetHandshakeHandler } from '@/components/handshakes/betting/Feed/BetHandshakeHandler';
import { handleLoadMatches, handleLoadMatchDetail } from '@/pages/Prediction/saga';
import { isBalanceInvalid } from '@/stores/common-saga';
import { showAlert } from '@/stores/common-action';
import { MESSAGE } from '@/components/handshakes/betting/message.js';
import { reportSelector } from './selector';
import {
  loadCreateEventData,
  createEvent,
  shareEvent,
  sendEmailCode,
  verifyEmail,
  verifyEmailCodePut,
  updateProfile,
  updateCreateEventLoading,
} from './action';

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
      _key: 'list',
    });
  } catch (e) {
    return console.error('handleLoadReportsSaga', e);
  }
}

function* handleLoadCreateEventData({ eventId }) {
  try {
    yield put(updateCreateEventLoading(true));
    yield all([
      call(handleLoadReportsSaga, {}),
      eventId && call(handleLoadMatchDetail, { eventId }),
      call(handleLoadMatches, {}),
      // call(handleLoadCategories, {}),
      call(isBalanceInvalid, {}),
    ]);
    yield put(updateCreateEventLoading(false));
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
    console.error('handleAddOutcomesSaga', e);
    return null;
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

function* handleGenerateShareLinkSaga({ matchId, ...payload }) {
  try {
    return yield call(apiPost, {
      PATH_URL: `${API_URL.CRYPTOSIGN.GENERATE_LINK}`,
      type: 'GENERATE_SHARE_LINK',
      data: {
        match_id: matchId,
      },
      ...payload,
    });
  } catch (e) {
    return console.error('handleGenerateShareLinkSaga', e);
  }
}

function* saveGenerateShareLinkToStore({ matchId, eventName }) {
  const generateLink = yield call(handleGenerateShareLinkSaga, { matchId });
  return yield put(shareEvent({
    url: `${window.location.origin}${URL.HANDSHAKE_PREDICTION}${generateLink.data.slug}`,
    name: eventName,
  }));
}

function* handleCreateEventSaga({ values, isNew }) {
  try {
    yield put(updateCreateEventLoading(true));
    const balanceInvalid = yield call(isBalanceInvalid);
    if (balanceInvalid) {
      yield put(showAlert({
        message: MESSAGE.NOT_ENOUGH_GAS.replace('{{value}}', balanceInvalid),
      }));
    } else {
      const betHandshakeHandler = BetHandshakeHandler.getShareManager();
      if (!isNew) {
        // Add new outcomes
        const newOutcomeList = values.outcomes.filter(o => !o.id).map(i => Object.assign({}, i, { public: 1 }));
        const { eventId } = values;
        const addOutcomeResult = yield call(handleAddOutcomesSaga, {
          eventId,
          newOutcomeList,
        });
        console.log('Add New outcomes', addOutcomeResult);
        if (!addOutcomeResult.error) {
          const inputData = addOutcomeResult.data.map(o => {
            return {
              fee: values.creatorFee,
              source: `${values.reports || '-'}`,
              closingTime: values.closingTime,
              reportTime: values.reportingTime,
              disputeTime: values.disputeTime,
              offchain: o.id,
              contractAddress: o.contract.contract_address,
              contractName: o.contract.json_name,
            };
          });
          const matchId = addOutcomeResult.data[0].match_id;
          const eventName = addOutcomeResult.data[0].name;
          yield saveGenerateShareLinkToStore({ matchId, eventName });
          betHandshakeHandler.createNewEvent(inputData);
        }
      } else {
        // Create new event
        const { reports } = values;
        const reportSource = reports.id ? { source_id: reports.id } : {
          source: {
            name: reports.value,
            url: reports.value,
          },
        };
        const newEventData = {
          homeTeamName: values.homeTeamName || '',
          awayTeamName: values.awayTeamName || '',
          homeTeamCode: values.homeTeamCode || '',
          awayTeamCode: values.awayTeamCode || '',
          homeTeamFlag: values.homeTeamFlag || '',
          awayTeamFlag: values.awayTeamFlag || '',
          name: values.eventName.label,
          public: values.private ? 0 : 1,
          date: values.closingTime,
          reportTime: values.reportingTime,
          disputeTime: values.disputeTime,
          market_fee: values.creatorFee,
          outcomes: values.outcomes,
          category_id: 7, // values.category.id, hard-code for now
          ...reportSource,
        };
        console.log('newEventData', newEventData);
        const { data } = yield call(handleCreateNewEventSaga, { newEventData });
        if (data && data.length) {
          const eventData = data[0];
          const { contract } = eventData;
          console.log('Contract:', contract);
          const inputData = eventData.outcomes.map(o => {
            return {
              fee: eventData.market_fee,
              source: eventData.source_name,
              closingTime: eventData.date,
              reportTime: eventData.reportTime,
              disputeTime: eventData.disputeTime,
              offchain: o.id,
              contractAddress: contract.contract_address,
              contractName: contract.json_name,
            };
          });
          const matchId = eventData.id;
          const eventName = eventData.name;
          yield saveGenerateShareLinkToStore({ matchId, eventName });
          betHandshakeHandler.createNewEvent(inputData);
        }
      }
    }
  } catch (e) {
    console.error('handleCreateNewEventSaga', e);
  } finally {
    yield put(updateCreateEventLoading(false));
  }
}

function* handleUpdateEmail({ email }) {
  try {
    const userProfile = new FormData();
    userProfile.set('email', email);
    const responded = yield call(apiPost, {
      PATH_URL: API_URL.USER.PROFILE,
      type: 'UPDATE_EMAIL_FETCH',
      data: userProfile,
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    if (responded.status) {
      yield put(updateProfile(responded));
    }
  } catch (e) {
    console.error('handleUpdateEmail', e);
  }
}

function* handleSendEmailCode({ email }) {
  try {
    const sendCode = yield call(apiPost, {
      PATH_URL: `user/verification/email/start?email=${email}`,
      type: 'SEND_EMAIL_CODE',
    });
    if (sendCode.error) {
      console.error('Failed to submit email: ', sendCode.error);
    }
  } catch (e) {
    console.error('handleSendEmailCode', e);
  }
}

function* handleVerifyEmail({ email, code }) {
  try {
    const verify = yield call(apiPost, {
      PATH_URL: `user/verification/email/check?email=${email}&code=${code}`,
      type: 'VERIFY_EMAIL',
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    if (!verify.status) {
      return yield put(verifyEmailCodePut(false));
    }
    yield put(verifyEmailCodePut(true));
    return yield handleUpdateEmail({ email });
  } catch (e) {
    console.error('handleVerifyEmail', e);
    return null;
  }
}

export default function* createMarketSaga() {
  yield takeLatest(loadCreateEventData().type, handleLoadCreateEventData);
  yield takeLatest(createEvent().type, handleCreateEventSaga);
  yield takeLatest(sendEmailCode().type, handleSendEmailCode);
  yield takeLatest(verifyEmail().type, handleVerifyEmail);
}
