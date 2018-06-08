import React from 'react';
import ReactDOM from 'react-dom';

// components
import App from '@/components/App/App';
import * as OfflinePlugin from 'offline-plugin/runtime';
// import registerServiceWorker from '@/services/worker';

OfflinePlugin.install({
  onUpdateReady() {
    OfflinePlugin.applyUpdate();
  },
  onUpdated() {
    window.location.reload();
  },
});
// registerServiceWorker();

// clear cache mode on:
if (process.env.TURN_OFF_CACHE && window.caches) {
  window.caches
    .keys()
    .then(keyList => Promise.all(keyList.map(key => window.caches.delete(key))));
}
//require('@/testing/web3_test');
// require('@/testing/web3_handshake');

ReactDOM.render(<App />, document.getElementById('app'));
