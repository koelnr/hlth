/**
 * Firebase Client SDK initialization.
 *
 * Safe to use in client components and server components alike.
 * Currently used as the foundation for future real-time features
 * (e.g. onSnapshot listeners in client components).
 *
 * For server-side data operations (server actions, route handlers,
 * server components), prefer the Admin SDK in ./admin.ts.
 *
 * Required environment variables (NEXT_PUBLIC_ prefix makes them
 * available on the client):
 *   NEXT_PUBLIC_FIREBASE_API_KEY
 *   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
 *   NEXT_PUBLIC_FIREBASE_PROJECT_ID
 *   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
 *   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
 *   NEXT_PUBLIC_FIREBASE_APP_ID
 */

import { FirebaseApp, getApps, initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let clientApp: FirebaseApp;

export function getClientApp(): FirebaseApp {
  if (!clientApp) {
    clientApp = getApps().length > 0 ? getApps()[0] : initializeApp(firebaseConfig);
  }
  return clientApp;
}
