import React from 'react';
import ReactDOM from 'react-dom';
import BrowserDetect from '@/services/browser-detect';
// components
import App from '@/components/App/App';
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

let app = <App />;
if (process.env.ENV === 'production') {
  app = BrowserDetect.isDesktop ? <MobileOrTablet /> : <App />;
}

ReactDOM.render(app, document.getElementById('app'));

