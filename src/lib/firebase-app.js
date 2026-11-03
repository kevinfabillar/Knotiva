// The Firebase web app, from the public VITE_FIREBASE_* env vars. Only imported lazily (live.js, upload.js).
import { initializeApp, getApps } from 'firebase/app';

const env = import.meta.env;
const config = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
};

export function firebaseApp() {
  if (!config.projectId || !config.apiKey) throw new Error('Firebase is not configured (VITE_FIREBASE_* env vars).');
  return getApps()[0] || initializeApp(config);
}
