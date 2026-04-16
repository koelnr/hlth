/**
 * Firebase Admin SDK initialization.
 *
 * This module is SERVER-ONLY. Never import it in client components or
 * any file that may be bundled for the browser.
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
