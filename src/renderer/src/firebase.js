import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyCw48P11KiZoRwAlyobqXVrnsVxSaHjo4k",
  authDomain: "apos-c7422.firebaseapp.com",
  projectId: "apos-c7422",
  storageBucket: "apos-c7422.appspot.com",
  messagingSenderId: "380701649048",
  appId: "1:380701649048:web:152d62142ba8677014c8ed"
};

const app = initializeApp(firebaseConfig);

const messaging = getMessaging(app);

export const requestFirebaseNotificationPermission = () =>
  new Promise((resolve, reject) => {
    Notification.requestPermission()
      .then(() =>
        getToken(messaging, {
          vapidKey:
            "BH_KHpJvlvP8kG5PqORAresQrerB9MhgjNdVukSBEbR196Of8UWB88Vu0BV0ZaldvzGS7IsdUuNDILn2T28Vozg",
        })
      )
      .then((firebaseToken) => {
        resolve(firebaseToken);
      })
      .catch((err) => {
        reject(err);
      });
  });

export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });
