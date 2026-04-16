import "server-only";

/**
 * Firebase Admin SDK initialization.
 *
 * SERVER-ONLY — enforced by the `server-only` import above.
 * Next.js will throw a build-time error if this module is accidentally
 * imported in a Client Component.
 *
 * Required environment variables:
 *   FIREBASE_ADMIN_PROJECT_ID
 *   FIREBASE_ADMIN_CLIENT_EMAIL
 *   FIREBASE_ADMIN_PRIVATE_KEY   (PEM key — newlines as \n in the env var)
 *   FIREBASE_STORAGE_BUCKET      (e.g. your-project.firebasestorage.app)
 */

import { cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

function createAdminApp() {
  const projectId = process.env.FIREBASE_ADMIN_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(
    /\\n/g,
    "\n"
  );

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(
      [
        "Firebase Admin SDK is not configured.",
        "Set FIREBASE_ADMIN_PROJECT_ID, FIREBASE_ADMIN_CLIENT_EMAIL,",
        "and FIREBASE_ADMIN_PRIVATE_KEY in your environment.",
      ].join(" ")
    );
  }

  return initializeApp({
    credential: cert({ projectId, clientEmail, privateKey }),
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  });
}

function getAdminApp() {
  return getApps().length > 0 ? getApp() : createAdminApp();
}

export function getAdminFirestore() {
  return getFirestore(getAdminApp());
}

export function getAdminStorage() {
  return getStorage(getAdminApp());
}
