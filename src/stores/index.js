import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import { firebaseReducer, reactReduxFirebase } from 'react-redux-firebase';
import thunk from 'redux-thunk';
import firebase from 'firebase';

import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';

import { firebase as firebaseConfig } from '@/config';
import history from '@/services/history';
import appReducer from '@/reducers/app';
import authReducer from '@/reducers/auth';
import reducers from '@/reducers';

firebase.initializeApp(firebaseConfig);

const AppReducers = combineReducers({
  app: appReducer,
  auth: authReducer,
  firebase: firebaseReducer,
  router: routerReducer,
  ...reducers,
});

const createStoreWithFirebase = compose(
  reactReduxFirebase(firebase, firebaseConfig),
  composeWithDevTools(applyMiddleware(routerMiddleware(history), thunk)),
)(createStore);

const store = createStoreWithFirebase(AppReducers);

export default store;
