// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: "mern-blog-b42df.firebaseapp.com",
  projectId: "mern-blog-b42df",
  storageBucket: "mern-blog-b42df.appspot.com",
  messagingSenderId: "4155756216",
  appId: "1:4155756216:web:19736349a0ea3426142e4d",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
