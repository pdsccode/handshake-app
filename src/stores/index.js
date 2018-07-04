import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { connectRouter, routerMiddleware } from 'connected-react-router';
import { firebaseReducer, reactReduxFirebase } from 'react-redux-firebase';
import thunk from 'redux-thunk';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/messaging';

import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly';

import history from '@/services/history';
import appReducer from '@/reducers/app';
import authReducer from '@/reducers/auth';
import reducers from '@/reducers';

firebase.initializeApp(process.env.firebase);

const rootReducer = combineReducers({
  app: appReducer,
  auth: authReducer,
  firebase: firebaseReducer,
  ...reducers,
});

const createStoreWithFirebase = compose(
  reactReduxFirebase(firebase, process.env.firebase),
  composeWithDevTools(applyMiddleware(routerMiddleware(history), thunk)),
)(createStore);

const store = createStoreWithFirebase(connectRouter(history)(rootReducer));

export default store;
