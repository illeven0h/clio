import { getApp, initializeApp, getApps } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Firebase Configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Initialize Firebase Services (wrapped in a function)
export const initializeFirebase = () => {
  let app, firestore;
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    firestore = getFirestore(app);
  } else {
    app = getApp();
    firestore = getFirestore();
  }

  const auth = getAuth(app);
  const storage = getStorage(app);

  let analytics;
  if (typeof window !== "undefined") {
    try {
      analytics = getAnalytics(app);
    } catch (error) {
      console.warn("Analytics could not be initialized:", error);
    }
  }

  return { auth, firestore, storage, analytics };
};
