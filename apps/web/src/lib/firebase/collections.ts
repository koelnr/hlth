/**
 * Firestore collection name constants.
 *
 * Centralized here so refactoring collection names is a one-line change.
 * All repositories import from this file rather than inlining string literals.
 *
 * Collection strategy: top-level collections, each document carries an
 * organizationId field. This makes cross-collection queries simple and
 * allows straightforward composite indexes.
 *
 * Security note: organizationId must be enforced both here (application layer)
 * and in Firestore security rules. See FIRESTORE_SECURITY.md for guidance.
 */

export const COLLECTIONS = {
  CLINIC_PROFILES: "clinic_profiles",
  PATIENTS: "patients",
  APPOINTMENTS: "appointments",
  FOLLOW_UPS: "follow_ups",
  CLINIC_MEMBERSHIPS: "clinic_memberships",
} as const;
