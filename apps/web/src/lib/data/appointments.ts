/**
 * Appointment repository.
 */

import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { getAdminFirestore } from "../firebase/admin";
import { COLLECTIONS } from "../firebase/collections";
import { baseFromDoc, toDate } from "./converters";
import type {
  Appointment,
  AppointmentStatus,
  CreateAppointmentInput,
  UpdateAppointmentInput,
} from "./models";

function fromDoc(doc: FirebaseFirestore.DocumentSnapshot): Appointment {
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

export async function createAppointment(
  input: CreateAppointmentInput
): Promise<Appointment> {
  const db = getAdminFirestore();
  const ref = db.collection(COLLECTIONS.APPOINTMENTS).doc();
  const now = Timestamp.now();

  await ref.set({
    ...input,
    scheduledAt: Timestamp.fromDate(input.scheduledAt),
    createdAt: now,
    updatedAt: now,
  });

  return {
    ...input,
    id: ref.id,
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
 * List appointments scheduled for today (in the server's local timezone).
 * For production, pass an explicit date range instead.
 */
export async function listTodaysAppointments(
  organizationId: string
): Promise<Appointment[]> {
  const db = getAdminFirestore();
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setHours(23, 59, 59, 999);

  const snap = await db
    .collection(COLLECTIONS.APPOINTMENTS)
    .where("organizationId", "==", organizationId)
    .where("scheduledAt", ">=", Timestamp.fromDate(startOfDay))
    .where("scheduledAt", "<=", Timestamp.fromDate(endOfDay))
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
