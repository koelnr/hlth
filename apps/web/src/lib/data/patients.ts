/**
 * Patient repository.
 *
 * All operations are scoped to an organizationId. Never call these
 * without a validated ViewerContext from requireOrganization().
 */

import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { getAdminFirestore } from "../firebase/admin";
import { COLLECTIONS } from "../firebase/collections";
import { baseFromDoc, toDate } from "./converters";
import type {
  CreatePatientInput,
  Patient,
  UpdatePatientInput,
} from "./models";

function fromDoc(doc: FirebaseFirestore.DocumentSnapshot): Patient {
  const d = doc.data()!;
  return {
    ...baseFromDoc(doc),
    firstName: d.firstName,
    lastName: d.lastName,
    fullName: d.fullName,
    phone: d.phone,
    email: d.email,
    dateOfBirth: d.dateOfBirth,
    gender: d.gender,
    notes: d.notes,
    createdByUserId: d.createdByUserId,
  };
}

/**
 * Create a new patient record.
 * fullName is derived automatically from firstName + lastName.
 */
export async function createPatient(input: CreatePatientInput): Promise<Patient> {
  const db = getAdminFirestore();
  const ref = db.collection(COLLECTIONS.PATIENTS).doc();
  const now = Timestamp.now();
  const fullName = `${input.firstName} ${input.lastName}`;

  await ref.set({
    ...input,
    fullName,
    createdAt: now,
    updatedAt: now,
  });

  return {
    ...input,
    id: ref.id,
    fullName,
    createdAt: now.toDate(),
    updatedAt: now.toDate(),
  };
}

/**
 * Fetch a single patient by ID.
 * Returns null if not found or if the document belongs to a different org.
 */
export async function getPatientById(
  id: string,
  organizationId: string
): Promise<Patient | null> {
  const db = getAdminFirestore();
  const doc = await db.collection(COLLECTIONS.PATIENTS).doc(id).get();

  if (!doc.exists) return null;
  const patient = fromDoc(doc);

  // Explicit org check — defense in depth against misconfigured callers
  if (patient.organizationId !== organizationId) return null;

  return patient;
}

/**
 * List all patients for an organization, newest first.
 */
export async function listPatientsForOrg(
  organizationId: string
): Promise<Patient[]> {
  const db = getAdminFirestore();
  const snap = await db
    .collection(COLLECTIONS.PATIENTS)
    .where("organizationId", "==", organizationId)
    .orderBy("createdAt", "desc")
    .get();

  return snap.docs.map(fromDoc);
}

/**
 * Update mutable fields on a patient record.
 * Automatically re-derives fullName if first or last name changes.
 */
export async function updatePatient(
  id: string,
  organizationId: string,
  updates: UpdatePatientInput
): Promise<void> {
  const db = getAdminFirestore();
  const ref = db.collection(COLLECTIONS.PATIENTS).doc(id);

  const doc = await ref.get();
  if (!doc.exists || doc.data()?.organizationId !== organizationId) {
    throw new Error("Patient not found");
  }

  const current = fromDoc(doc);
  const firstName = updates.firstName ?? current.firstName;
  const lastName = updates.lastName ?? current.lastName;

  await ref.update({
    ...updates,
    fullName: `${firstName} ${lastName}`,
    updatedAt: FieldValue.serverTimestamp(),
  });
}
