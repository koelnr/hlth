/**
 * Firestore ↔ application type conversion utilities.
 *
 * Firestore stores dates as Timestamp objects. Our models use plain Date.
 * These helpers handle the boundary conversion in repositories so callers
 * never see raw Firestore types.
 */

import type { DocumentSnapshot, Timestamp } from "firebase-admin/firestore";

/**
 * Convert a Firestore Timestamp to a JS Date.
 * Throws if the value is missing or unrecognized — a missing date field
 * indicates a write bug and must never silently produce a wrong timestamp
 * (e.g. corrupting scheduledAt or dueAt to "right now").
 */
export function toDate(value: unknown): Date {
  if (value && typeof (value as Timestamp).toDate === "function") {
    return (value as Timestamp).toDate();
  }
  if (value instanceof Date) return value;
  throw new Error(
    `Expected a Firestore Timestamp, got: ${JSON.stringify(value)}`
  );
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
