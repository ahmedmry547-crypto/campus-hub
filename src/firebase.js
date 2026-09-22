// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyD8gEBYgzJixCbQj1w3YNTBRIJvh94zh7o",
    authDomain: "campushub-324f5.firebaseapp.com",
    projectId: "campushub-324f5",
    storageBucket: "campushub-324f5.firebasestorage.app",
    messagingSenderId: "312386271888",
    appId: "1:312386271888:web:4af0db8434cf4ebf417615",
    measurementId: "G-FRZBT6Z4JC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);