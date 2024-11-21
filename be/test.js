// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAXBBktxOuhPTCf-v9M3CtzpbmOwJDoo20",
  authDomain: "haq-gara.firebaseapp.com",
  projectId: "haq-gara",
  storageBucket: "haq-gara.firebasestorage.app",
  messagingSenderId: "849576604123",
  appId: "1:849576604123:web:18862fdfcd0557859477fe",
  measurementId: "G-FDR1JTFEGX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);