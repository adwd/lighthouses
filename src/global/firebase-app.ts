import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { env } from '../env';
import { authState as rxfireAuthStore } from 'rxfire/auth';

const config = {
  apiKey: env.FIREBASE_API_KEY,
  authDomain: 'light-houses.firebaseapp.com',
  databaseURL: 'https://light-houses.firebaseio.com',
  projectId: 'light-houses',
  storageBucket: '',
  messagingSenderId: '354496450286',
};

export const app = firebase.initializeApp(config);

firebase.firestore().settings({ timestampsInSnapshots: true });

export const authState = rxfireAuthStore(app.auth());
