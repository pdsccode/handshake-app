import { createStore, combineReducers, applyMiddleware } from 'redux';
import { routerReducer, routerMiddleware } from 'react-router-redux';
import history from '@/services/history';
import appReducer from '@/reducers/app';
import authReducer from '@/reducers/auth';
import exchangeReducer from '@/reducers/exchange';
import thunk from 'redux-thunk';
import reducers from '@/reducers';

const reducersApp = combineReducers({
  app: appReducer,
  auth: authReducer,
  exchange: exchangeReducer,
  router: routerReducer,
  ...reducers,
});

const store = createStore(
  reducersApp,
  applyMiddleware(
    routerMiddleware(history),
    thunk,
  )
);

export default store;
