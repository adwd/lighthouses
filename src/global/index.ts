import firebase from 'firebase/app';
import { app, authState } from './firebase-app';
import { Observable } from 'rxjs';

declare var Context: {
  firebaseApp: firebase.app.App;
  authState: Observable<firebase.User | null>;
};

Context.firebaseApp = app;
Context.authState = authState;
