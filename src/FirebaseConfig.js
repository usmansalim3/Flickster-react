import firebase from "firebase/compat/app";
import "firebase/compat/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAQyvF_5oXSlz-Nm7pDSKjnfam2EX41-D0",
  authDomain: "flickster-d288e.firebaseapp.com",
  projectId: "flickster-d288e",
  storageBucket: "flickster-d288e.appspot.com",
  messagingSenderId: "467135725734",
  appId: "1:467135725734:web:a76d288a93b4293e9c3467",
  measurementId: "G-2KHQCT0Z5E"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig)
const auth=firebase.auth()
const googleAuthProvider=new firebase.auth.GoogleAuthProvider()
export {auth,googleAuthProvider}
