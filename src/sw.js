importScripts('https://www.gstatic.com/firebasejs/4.1.3/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.1.3/firebase-database.js');
importScripts('https://www.gstatic.com/firebasejs/4.1.3/firebase-messaging.js');

// ON NOTIFICATION CLICK
self.addEventListener('notificationclick', (event) => {
  console.log(event);

  event.notification.close();

  event.waitUntil(self.clients.openWindow('https://stag-handshake.autonomous.ai/discover'));
});


firebase.initializeApp({
  apiKey: 'AIzaSyAY_QJ_6ZmuYfNR_oM65a0JVvzIyMb-n9Q',
  authDomain: 'handshake-205007.firebaseapp.com',
  databaseURL: 'https://handshake-205007.firebaseio.com',
  projectId: 'handshake-205007',
  storageBucket: 'handshake-205007.appspot.com',
  messagingSenderId: '852789708485',
});

const messaging = firebase.messaging();
