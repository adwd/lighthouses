import { collection } from 'rxfire/firestore';
import firebase from 'firebase/app';
import 'firebase/firestore';
import { Observable } from 'rxjs';

const col = {
  users: 'users',
  apps: 'apps',
  lhrs: 'lhrs',
};

export function setLoginUser(
  db: firebase.firestore.Firestore,
  user: firebase.User
): Promise<void> {
  return userDoc(db, user.uid).set({
    email: user.email,
    photoURL: user.photoURL,
    displayName: user.displayName,
  });
};

export function appCollection(
  db: firebase.firestore.Firestore,
  userId: string,
): Observable<firebase.firestore.QueryDocumentSnapshot[]> {
  return collection(
    userDoc(db, userId).collection(col.apps)
  );
}

export function addApp(
  db: firebase.firestore.Firestore,
  userId: string,
  appURL: string,
): Promise<firebase.firestore.DocumentReference> {
  return userDoc(db, userId).collection(col.apps).add({
    url: appURL,
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  })
}

export function deleteApp(
  db: firebase.firestore.Firestore,
  userId: string,
  appId: string,
): Promise<void> {
  return appDoc(db, userId, appId).delete();
}

export function lhrCollection(
  db: firebase.firestore.Firestore,
  userId: string,
  appId: string
): Observable<firebase.firestore.QueryDocumentSnapshot[]> {
  return collection(
    appDoc(db, userId, appId).collection(col.lhrs)
  );
}

function userDoc(
  db: firebase.firestore.Firestore,
  userId: string,
): firebase.firestore.DocumentReference {
  return db.collection(col.users).doc(userId);
}

function appDoc(
  db: firebase.firestore.Firestore,
  userId: string,
  appId: string
): firebase.firestore.DocumentReference {
  return db.collection(col.users).doc(userId)
    .collection(col.apps).doc(appId);
}
