/**
 * Firebase Admin SDK Initialization - I AM MAIL
 * Centralized Firebase configuration to ensure proper initialization order
 */

import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin only once
function initializeFirebase(): Firestore {
    // Check if Firebase credentials are configured
    const hasFirebaseConfig = process.env.FIREBASE_PROJECT_ID &&
        process.env.FIREBASE_CLIENT_EMAIL &&
        process.env.FIREBASE_PRIVATE_KEY;

    if (!hasFirebaseConfig) {
        console.warn('⚠️ Firebase not configured. Set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY in .env');
        // Return a mock Firestore that will throw meaningful errors
        throw new Error('Firebase not configured. Please set Firebase environment variables.');
    }

    // Initialize only if no apps exist
    if (!getApps().length) {
        try {
            initializeApp({
                credential: cert({
                    projectId: process.env.FIREBASE_PROJECT_ID,
                    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
                })
            });
            console.log('✅ Firebase Admin SDK initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize Firebase:', error);
            throw error;
        }
    }

    return getFirestore();
}

// Export initialized Firestore instance
export const db = initializeFirebase();

// Export helper to check if Firebase is configured
export function isFirebaseConfigured(): boolean {
    return !!(
        process.env.FIREBASE_PROJECT_ID &&
        process.env.FIREBASE_CLIENT_EMAIL &&
        process.env.FIREBASE_PRIVATE_KEY
    );
}
