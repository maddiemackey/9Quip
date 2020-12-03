import firebase from "firebase";
import "firebase/database";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCrnItxtYqR8zQpIxEMgvIOpBnwJSqaTR8",
    authDomain: "ninequip.firebaseapp.com",
    databaseURL: "https://ninequip-default-rtdb.firebaseio.com",
    projectId: "ninequip",
    storageBucket: "ninequip.appspot.com",
    messagingSenderId: "1051346267857",
    appId: "1:1051346267857:web:c91c8c2d7197a6edccdff0",
    measurementId: "G-29W9JN5DXS"
  };

firebase.initializeApp(firebaseConfig);
export default firebase;