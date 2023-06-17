import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyABtn46rqRh5b9TuIDN6Bs7HEWBxhJgR44',
  authDomain: 'nokia-hackathon.firebaseapp.com',
  projectId: 'nokia-hackathon',
  storageBucket: 'nokia-hackathon.appspot.com',
  messagingSenderId: '426424873666',
  appId: '1:426424873666:web:76988e328a72f6215a415b',
  measurementId: 'G-R7X2ZL8C3N',
};

export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence);
