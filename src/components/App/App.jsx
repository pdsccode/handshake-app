import React from 'react';
import { hot } from 'react-hot-loader';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import Router from '@/components/Router/Router';
import store from '@/stores';
import history from '@/services/history';

import 'rc-collapse/assets/index.css';
import '@/styles/main';
import 'weui';
import 'react-weui/build/packages/react-weui.css';

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Router />
        </ConnectedRouter>
      </Provider>
    );
  }
}

export default hot(module)(App);
