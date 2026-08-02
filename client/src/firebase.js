// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-1ff15.firebaseapp.com",
  projectId: "mern-estate-1ff15",
  storageBucket: "mern-estate-1ff15.firebasestorage.app",
  messagingSenderId: "669599822883",
  appId: "1:669599822883:web:6a6d8c14fd3b5c01fc6d96"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);