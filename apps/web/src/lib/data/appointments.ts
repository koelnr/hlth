import "server-only";

/**
 * Appointment repository.
 */

import { FieldValue, Timestamp } from "firebase-admin/firestore";
import type { DocumentSnapshot } from "firebase-admin/firestore";
import { getAdminFirestore } from "../firebase/admin";
import { COLLECTIONS } from "../firebase/collections";
import { baseFromDoc, toDate } from "./converters";
import type {
  Appointment,
  AppointmentStatus,
  CreateAppointmentInput,
  UpdateAppointmentInput,
} from "./models";

function fromDoc(doc: DocumentSnapshot): Appointment {
  const d = doc.data()!;
  return {
    ...baseFromDoc(doc),
    patientId: d.patientId,
    clinicianUserId: d.clinicianUserId,
    scheduledAt: toDate(d.scheduledAt),
    durationMinutes: d.durationMinutes,
    status: d.status as AppointmentStatus,
    reason: d.reason,
    notes: d.notes,
    createdByUserId: d.createdByUserId,
  };
}

/**
 * Create a new appointment.
 * organizationId is passed explicitly — never trust caller-supplied field values.
 */
export async function createAppointment(
  organizationId: string,
  input: CreateAppointmentInput
): Promise<Appointment> {
  const db = getAdminFirestore();
  const ref = db.collection(COLLECTIONS.APPOINTMENTS).doc();
  const now = Timestamp.now();

  await ref.set({
    ...input,
    organizationId,
    scheduledAt: Timestamp.fromDate(input.scheduledAt),
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

export async function getAppointmentById(
  id: string,
  organizationId: string
): Promise<Appointment | null> {
  const db = getAdminFirestore();
  const doc = await db.collection(COLLECTIONS.APPOINTMENTS).doc(id).get();

  if (!doc.exists) return null;
  const appt = fromDoc(doc);
  if (appt.organizationId !== organizationId) return null;

  return appt;
}

/**
 * List all appointments for an org, most recent first.
 */
export async function listAppointmentsForOrg(
  organizationId: string
): Promise<Appointment[]> {
  const db = getAdminFirestore();
  const snap = await db
    .collection(COLLECTIONS.APPOINTMENTS)
    .where("organizationId", "==", organizationId)
    .orderBy("scheduledAt", "desc")
    .get();

  return snap.docs.map(fromDoc);
}

/**
 * List appointments for a specific patient.
 * Requires composite index: organizationId ASC + patientId ASC + scheduledAt DESC
 */
export async function listAppointmentsForPatient(
  organizationId: string,
  patientId: string
): Promise<Appointment[]> {
  const db = getAdminFirestore();
  const snap = await db
    .collection(COLLECTIONS.APPOINTMENTS)
    .where("organizationId", "==", organizationId)
    .where("patientId", "==", patientId)
    .orderBy("scheduledAt", "desc")
    .get();

  return snap.docs.map(fromDoc);
}

/**
 * List appointments within a date range, ordered by scheduledAt ascending.
 * Pass timezone-adjusted start/end dates from the caller — do not compute
 * "today" server-side, as the server runs UTC and clinics may be in any timezone.
 *
 * Example for "today" in a server action:
 *   const tz = viewer.timezone ?? "UTC";
 *   const { startOfDay, endOfDay } = getTodayBounds(tz); // your own util
 *   const appts = await listAppointmentsInRange(orgId, startOfDay, endOfDay);
 *
 * Requires composite index: organizationId ASC + scheduledAt ASC
 */
export async function listAppointmentsInRange(
  organizationId: string,
  from: Date,
  to: Date
): Promise<Appointment[]> {
  const db = getAdminFirestore();
  const snap = await db
    .collection(COLLECTIONS.APPOINTMENTS)
    .where("organizationId", "==", organizationId)
    .where("scheduledAt", ">=", Timestamp.fromDate(from))
    .where("scheduledAt", "<=", Timestamp.fromDate(to))
    .orderBy("scheduledAt", "asc")
    .get();

  return snap.docs.map(fromDoc);
}

export async function updateAppointment(
  id: string,
  organizationId: string,
  updates: UpdateAppointmentInput
): Promise<void> {
  const db = getAdminFirestore();
  const ref = db.collection(COLLECTIONS.APPOINTMENTS).doc(id);

  const doc = await ref.get();
  if (!doc.exists || doc.data()?.organizationId !== organizationId) {
    throw new Error("Appointment not found");
  }

  const firestoreUpdates: Record<string, unknown> = {
    ...updates,
    updatedAt: FieldValue.serverTimestamp(),
  };

  if (updates.scheduledAt) {
    firestoreUpdates.scheduledAt = Timestamp.fromDate(updates.scheduledAt);
  }

  await ref.update(firestoreUpdates);
}
