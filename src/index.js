import React from 'react';
import ReactDOM from 'react-dom';
// components
import App from '@/components/App/App';
import registerServiceWorker from '@/services/worker';
import * as OfflinePluginRuntime from 'offline-plugin/runtime';

OfflinePluginRuntime.install();

if (!String.prototype.format) {
  String.prototype.format = function () {
    const args = arguments;
    return this.replace(
      /{(\d+)}/g,
      (match, number) =>
        (typeof args[number] !== 'undefined' ? args[number] : match),
    );
  };
}

if (window.caches) window.caches.keys().then(keyList => Promise.all(keyList.map(key => window.caches.delete(key))));

ReactDOM.render(<App />, document.getElementById('app'));
registerServiceWorker();
