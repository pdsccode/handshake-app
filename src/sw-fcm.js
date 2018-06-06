import logo from '@/assets/images/app/logo.png';

importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');

firebase.initializeApp({
  messagingSenderId: process.env.isProduction ? '514369332063' : '852789708485',
});

const messaging = firebase.messaging();

messaging.setBackgroundMessageHandler((payload) => {
  console.log('[firebase-messaging-sw.js] Received background message', payload);
  const notificationTitle = payload.title;
  const notificationOptions = {
    body: payload.body,
    icon: logo,
  };

  return self.registration.showNotification(
    notificationTitle,
    notificationOptions,
  );
});
