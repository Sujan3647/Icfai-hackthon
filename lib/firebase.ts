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

// Initialize Firebase
initializeFirebase();

// Export db with a getter to ensure it's only called when needed
export const getDb = () => {
  if (!getApps().length) {
    throw new Error("Firebase is not initialized. Please check your environment variables.");
  }
  return getFirestore();
};

// For backwards compatibility
export const db = new Proxy({} as ReturnType<typeof getFirestore>, {
  get(target, prop) {
    return getDb()[prop as keyof ReturnType<typeof getFirestore>];
  }
});
