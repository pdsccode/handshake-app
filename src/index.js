import React from 'react';
import ReactDOM from 'react-dom';

// components
import Website from '@/components/App/Basic';
// import registerServiceWorker from '@/services/worker';
import * as OfflinePlugin from 'offline-plugin/runtime';

// registerServiceWorker();

if (process.env.caches) {
  OfflinePlugin.install({
    onUpdateReady() {
      OfflinePlugin.applyUpdate();
    },
    onUpdated() {
      window.location.reload();
    },
  });
} else {
  if (window.caches) {
    window.caches
      .keys()
      .then(keyList => Promise.all(keyList.map(key => window.caches.delete(key))));
  }
  if (navigator.serviceWorker) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      registrations.forEach((sw) => {
        if (/\/sw.js$/.test(sw.active.scriptURL)) {
          sw.unregister();
        }
      });
    });
  }
}

function parseQueryString() {
  let query = window.location.search;
  let obj = {},
      qPos = query.indexOf("?"),
  tokens = query.substr(qPos + 1).split('&'),
  i = tokens.length - 1;
  if (qPos !== -1 || query.indexOf("=") !== -1) {
  for (; i >= 0; i--) {
    let s = tokens[i].split('=');
    obj[unescape(s[0])] = s.hasOwnProperty(1) ? unescape(s[1]) : null;
  };
  }
  return obj;
}

const {ref} = parseQueryString();
if (ref) localStorage.setItem("ref", ref);

ReactDOM.render(<Website />, document.getElementById('app'));
const root = document.getElementById('root');
if (root) root.addEventListener('contextmenu', e => e.preventDefault());
