import React from 'react';
import ReactDOM from 'react-dom';
import App from '@/components/App/App';
import registerServiceWorker from '@/services/worker';


if (!String.prototype.format) { String.prototype.format = function format() { const args = arguments; return this.replace(/{(\d+)}/g, (match, number) => (typeof args[number] !== 'undefined' ? args[number] : match)); }; }

// require('../testing/test_handshake_blockchain');

ReactDOM.render(<App />, document.getElementById('app'));
registerServiceWorker();
require('offline-plugin/runtime').install();
