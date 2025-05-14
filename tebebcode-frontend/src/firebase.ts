// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getAnalytics } from 'firebase/analytics';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCsEH0Cda-LHK_zRcuCUtSfP93Ae1O231o",
  authDomain: "tebebcode.firebaseapp.com",
  projectId: "tebebcode",
  storageBucket: "tebebcode.firebasestorage.app",
  messagingSenderId: "941217515539",
  appId: "1:941217515539:web:4f2dd11d04c39382ff17e6",
  measurementId: "G-X7W9HHC1Q3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);
