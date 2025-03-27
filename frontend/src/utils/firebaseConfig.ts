import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Import the Firebase config from app
import { firebaseConfig } from 'app/auth/config';

// Note: The utility functions for authentication are now handled by app/auth

// Initialize Firebase
// Use the firebase app from the app/auth module to avoid duplicate initialization errors
import { firebaseApp, firebaseAuth } from 'app/auth';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

export const auth = firebaseAuth;
export const db = getFirestore(firebaseApp);
