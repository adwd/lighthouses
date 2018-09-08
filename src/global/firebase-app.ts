import firebase from 'firebase/app';
import 'firebase/auth';
import { env } from '../env';
import { Observable } from 'rxjs';

const config = {
  apiKey: env.FIREBASE_API_KEY,
  authDomain: 'light-houses.firebaseapp.com',
  databaseURL: 'https://light-houses.firebaseio.com',
  projectId: 'light-houses',
  storageBucket: '',
  messagingSenderId: '354496450286',
};

export const app = firebase.initializeApp(config);

export const authState = new Observable<firebase.User | null>(observer => {
  app.auth().onAuthStateChanged(observer);
});
