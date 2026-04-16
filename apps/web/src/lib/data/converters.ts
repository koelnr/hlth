/**
 * Firestore ↔ application type conversion utilities.
 *
 * Firestore stores dates as Timestamp objects. Our models use plain Date.
 * These helpers handle the boundary conversion in repositories so callers
 * never see raw Firestore types.
 */

import type { DocumentSnapshot, Timestamp } from "firebase-admin/firestore";

/**
 * Convert a Firestore Timestamp (or anything Date-like) to a JS Date.
 * Falls back to current time if the value is missing or unrecognized —
 * this shouldn't happen in practice but prevents hard crashes on bad data.
 */
export function toDate(value: unknown): Date {
  if (value && typeof (value as Timestamp).toDate === "function") {
    return (value as Timestamp).toDate();
  }
  if (value instanceof Date) return value;
  return new Date();
}

/**
 * Pull the common BaseRecord fields from a Firestore document snapshot.
 * Use this inside every repository's fromDoc() function.
 */
export function baseFromDoc(doc: DocumentSnapshot) {
  const d = doc.data()!;
  return {
    id: doc.id,
    organizationId: d.organizationId as string,
    createdAt: toDate(d.createdAt),
    updatedAt: toDate(d.updatedAt),
  };
}
