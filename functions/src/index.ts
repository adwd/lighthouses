import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { launchChromeAndRunLighthouse, uploadReport } from './create-app';

const adminApp = admin.initializeApp(functions.config().firebase);
admin.firestore(adminApp).settings({ timestampsInSnapshots: true });

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

// When app is created, run lighthouse and write result to firestore.
exports.createApp = functions.firestore
    .document('users/{userId}/apps/{appId}')
    .onCreate(async (snap, context) => {
      const { url } = snap.data();
      const result = await launchChromeAndRunLighthouse(url);
      const html = result.report;
      delete result.report;
      
      await uploadReport(adminApp, result, html, context.params.userId, context.params.appId);
    });

// When report is uploaded to storage, save path to firesotre
exports.reportCompleted = functions.storage.object().onFinalize(async (object) => {
  const re = /(\w+)\/(\w+)\/([\w-]+)-report\.json$/;
  const result = object.name.match(re);
  if (!result) {
    return null;
  }
  const [, userId, appId] = result;

  await adminApp.firestore().collection('users').doc(userId)
    .collection('apps').doc(appId)
    .collection('lhrs')
    .add({
      path: object.name,
    });
});
