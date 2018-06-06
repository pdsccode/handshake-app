import React from 'react';
import ReactDOM from 'react-dom';
import BrowserDetect from '@/services/browser-detect';
// components
import App from '@/components/App/App';
import registerServiceWorker from '@/services/worker';
import MobileOrTablet from '@/components/MobileOrTablet';


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

let app = <App />;
if (process.env.NODE_ENV === 'production') {
  app = BrowserDetect.isDesktop ? <MobileOrTablet /> : <App />;
}

ReactDOM.render(app, document.getElementById('app'));

registerServiceWorker();
require('offline-plugin/runtime').install();
