import "server-only";

/**
 * Follow-up repository.
 */

import { FieldValue, Timestamp } from "firebase-admin/firestore";
import type { DocumentSnapshot } from "firebase-admin/firestore";
import { getAdminFirestore } from "../firebase/admin";
import { COLLECTIONS } from "../firebase/collections";
import { baseFromDoc, toDate } from "./converters";
import type {
  CreateFollowUpInput,
  FollowUp,
  FollowUpStatus,
  UpdateFollowUpInput,
} from "./models";

function fromDoc(doc: DocumentSnapshot): FollowUp {
  const d = doc.data()!;
  return {
    ...baseFromDoc(doc),
    patientId: d.patientId,
    appointmentId: d.appointmentId,
    dueAt: toDate(d.dueAt),
    status: d.status as FollowUpStatus,
    note: d.note,
    createdByUserId: d.createdByUserId,
  };
}

/**
 * Create a new follow-up.
 * organizationId is passed explicitly — never trust caller-supplied field values.
 */
export async function createFollowUp(
  organizationId: string,
  input: CreateFollowUpInput
): Promise<FollowUp> {
  const db = getAdminFirestore();
  const ref = db.collection(COLLECTIONS.FOLLOW_UPS).doc();
  const now = Timestamp.now();

  await ref.set({
    ...input,
    organizationId,
    dueAt: Timestamp.fromDate(input.dueAt),
    createdAt: now,
    updatedAt: now,
  });

  return {
    ...input,
    id: ref.id,
    organizationId,
    createdAt: now.toDate(),
    updatedAt: now.toDate(),
  };
}

export async function getFollowUpById(
  id: string,
  organizationId: string
): Promise<FollowUp | null> {
  const db = getAdminFirestore();
  const doc = await db.collection(COLLECTIONS.FOLLOW_UPS).doc(id).get();

  if (!doc.exists) return null;
  const followUp = fromDoc(doc);
  if (followUp.organizationId !== organizationId) return null;

  return followUp;
}

/**
 * List all pending follow-ups for an org ordered by due date ascending
 * so the most overdue items appear first.
 * Requires composite index: organizationId ASC + status ASC + dueAt ASC
 */
export async function listPendingFollowUps(
  organizationId: string
): Promise<FollowUp[]> {
  const db = getAdminFirestore();
  const snap = await db
    .collection(COLLECTIONS.FOLLOW_UPS)
    .where("organizationId", "==", organizationId)
    .where("status", "==", "pending")
    .orderBy("dueAt", "asc")
    .get();

  return snap.docs.map(fromDoc);
}

/**
 * List all follow-ups for a patient.
 * Requires composite index: organizationId ASC + patientId ASC + dueAt DESC
 */
export async function listFollowUpsForPatient(
  organizationId: string,
  patientId: string
): Promise<FollowUp[]> {
  const db = getAdminFirestore();
  const snap = await db
    .collection(COLLECTIONS.FOLLOW_UPS)
    .where("organizationId", "==", organizationId)
    .where("patientId", "==", patientId)
    .orderBy("dueAt", "desc")
    .get();

  return snap.docs.map(fromDoc);
}

export async function updateFollowUp(
  id: string,
  organizationId: string,
  updates: UpdateFollowUpInput
): Promise<void> {
  const db = getAdminFirestore();
  const ref = db.collection(COLLECTIONS.FOLLOW_UPS).doc(id);

  const doc = await ref.get();
  if (!doc.exists || doc.data()?.organizationId !== organizationId) {
    throw new Error("Follow-up not found");
  }

  const firestoreUpdates: Record<string, unknown> = {
    ...updates,
    updatedAt: FieldValue.serverTimestamp(),
  };

  if (updates.dueAt) {
    firestoreUpdates.dueAt = Timestamp.fromDate(updates.dueAt);
  }

  await ref.update(firestoreUpdates);
}

/**
 * List all follow-ups for an org across all statuses, sorted by dueAt ascending.
 * Sorted in-memory to avoid composite index requirements.
 */
export async function listFollowUpsByOrganization(
  organizationId: string
): Promise<FollowUp[]> {
  const db = getAdminFirestore();
  const snap = await db
    .collection(COLLECTIONS.FOLLOW_UPS)
    .where("organizationId", "==", organizationId)
    .get();

  const followUps = snap.docs.map(fromDoc);
  followUps.sort((a, b) => a.dueAt.getTime() - b.dueAt.getTime());
  return followUps;
}

/**
 * Hard-delete a follow-up. Verifies org ownership before deleting.
 */
export async function deleteFollowUp(
  id: string,
  organizationId: string
): Promise<void> {
  const db = getAdminFirestore();
  const ref = db.collection(COLLECTIONS.FOLLOW_UPS).doc(id);

  const doc = await ref.get();
  if (!doc.exists || doc.data()?.organizationId !== organizationId) {
    throw new Error("Follow-up not found");
  }

  await ref.delete();
}
