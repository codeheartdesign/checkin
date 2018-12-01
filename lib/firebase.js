import * as firebase from "firebase";

const config = {
  apiKey: 'XXXX',
  authDomain: 'XXXX',
  databaseURL: 'XXXX',
  projectId: 'XXXX',
  storageBucket: 'XXXX',
  messagingSenderId: 'XXXX',
};

export default !firebase.apps.length ? firebase.initializeApp(config) : firebase.app();
