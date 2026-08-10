import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

// Placeholder configuration - replace with actual Firebase config when available
const firebaseConfig = {
  apiKey: "AIzaSyAIIFdZ-VybFw0CwZqUFxIMNLCJC2SjR5w",
  authDomain: "voice-service-system.firebaseapp.com",
  projectId: "voice-service-system",
  storageBucket: "voice-service-system.firebasestorage.app",
  messagingSenderId: "602230840366",
  appId: "1:602230840366:web:4f98c09344c4f29c3213bf",
  measurementId: "G-E0S3K34JKQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);

// Enable offline persistence for instant loading
enableIndexedDbPersistence(db).catch((err) => {
  if (err.code == 'failed-precondition') {
    console.warn("Multiple tabs open, persistence can only be enabled in one tab at a time.");
  } else if (err.code == 'unimplemented') {
    console.warn("The current browser does not support all of the features required to enable persistence.");
  }
});
