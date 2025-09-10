// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBe2tXzr-7Hgox9CJ175KjYllF-9CtQHus",
  authDomain: "prepwise-f93b6.firebaseapp.com",
  projectId: "prepwise-f93b6",
  storageBucket: "prepwise-f93b6.firebasestorage.app",
  messagingSenderId: "77395808358",
  appId: "1:77395808358:web:2271b46415039d3dc85da7",
  measurementId: "G-TNT6WWHQ0R"
};

// Initialize Firebase (avoid duplicate initialization)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize Analytics only in browser environment
export const analytics = typeof window !== 'undefined'
  ? getAnalytics(app)
  : null;

// Function to check analytics support asynchronously
export const initAnalyticsIfSupported = async () => {
  if (typeof window !== 'undefined' && await isSupported()) {
    return getAnalytics(app);
  }
  return null;
};

export { app };