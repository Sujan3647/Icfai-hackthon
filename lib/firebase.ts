import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin only when credentials are available
function initializeFirebase() {
  if (getApps().length) {
    return;
  }

  if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
    console.warn("Firebase credentials not found. Firebase will not be initialized.");
    return;
  }

  try {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
  } catch (error) {
    console.error("Failed to initialize Firebase:", error);
  }
}

// Export db with lazy initialization
let _db: ReturnType<typeof getFirestore> | null = null;

export const db = new Proxy({} as ReturnType<typeof getFirestore>, {
  get(target, prop) {
    if (!_db) {
      initializeFirebase();
      if (!getApps().length) {
        throw new Error("Firebase is not initialized. Please check your environment variables.");
      }
      _db = getFirestore();
    }
    return _db[prop as keyof ReturnType<typeof getFirestore>];
  }
});
