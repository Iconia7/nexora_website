// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCPJs5TR3wtkbr1mkx-XbyAwQzAz6lNTZM",
  authDomain: "nexora-creative.firebaseapp.com",
  projectId: "nexora-creative",
  storageBucket: "nexora-creative.firebasestorage.app",
  messagingSenderId: "264622332898",
  appId: "1:264622332898:web:fc028517f0a986fcbd77bb",
  measurementId: "G-NSX371NW4E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);