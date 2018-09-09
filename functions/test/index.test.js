const path = require('path');
const sinon = require('sinon');
const admin = require('firebase-admin');
// const test = require('firebase-functions-test')({
//   databaseURL: 'https://light-houses-test.firebaseio.com',
//   storageBucket: 'light-houses-test.appspot.com',
//   projectId: 'light-houses-test',
// }, path.join(__dirname, '../../service-account-key.json'));
const test = require('firebase-functions-test')();

// If index.js calls admin.initializeApp at the top of the file,
// we need to stub it out before requiring index.js. This is because the
// functions will be executed as a part of the require process.
// Here we stub admin.initializeApp to be a dummy function that doesn't do anything.
adminInitStub = sinon.stub(admin, 'initializeApp');

const myFunctions = require('../lib/index.js');

describe('uploadReport', () => {
  it('should run', async () => {
    const result = await myFunctions.uploadReport('{foo: "bar"}', '<html></html>');

  });
});
