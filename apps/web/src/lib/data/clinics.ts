import "server-only";

/**
 * Clinic profile repository.
 *
 * One ClinicProfile per Clerk organization. Created during onboarding
 * after the org is set up in Clerk.
 */

import { FieldValue, Timestamp } from "firebase-admin/firestore";
import type { DocumentSnapshot } from "firebase-admin/firestore";
import { getAdminFirestore } from "../firebase/admin";
import { COLLECTIONS } from "../firebase/collections";
import { baseFromDoc } from "./converters";
import type {
  ClinicProfile,
  CreateClinicProfileInput,
  UpdateClinicProfileInput,
} from "./models";

function fromDoc(doc: DocumentSnapshot): ClinicProfile {
  const d = doc.data()!;
  return {
    ...baseFromDoc(doc),
    name: d.name,
    slug: d.slug,
    specialty: d.specialty,
    phone: d.phone,
    email: d.email,
    address: d.address,
  };
}

/**
 * Create a new clinic profile for a Clerk organization.
 * organizationId is passed explicitly — never trust caller-supplied field values.
 */
export async function createClinicProfile(
  organizationId: string,
  input: CreateClinicProfileInput
): Promise<ClinicProfile> {
  const db = getAdminFirestore();
  const ref = db.collection(COLLECTIONS.CLINIC_PROFILES).doc();
  const now = Timestamp.now();

  await ref.set({ ...input, organizationId, createdAt: now, updatedAt: now });

  return {
    ...input,
    id: ref.id,
    organizationId,
    createdAt: now.toDate(),
    updatedAt: now.toDate(),
  };
}

/**
 * Get the clinic profile for an organization.
 * Returns null if not yet created (pre-onboarding).
 */
export async function getClinicProfile(
  organizationId: string
): Promise<ClinicProfile | null> {
  const db = getAdminFirestore();
  const snap = await db
    .collection(COLLECTIONS.CLINIC_PROFILES)
    .where("organizationId", "==", organizationId)
    .limit(1)
    .get();

  if (snap.empty) return null;
  return fromDoc(snap.docs[0]);
}

/**
 * Update mutable fields on a clinic profile.
 */
export async function updateClinicProfile(
  id: string,
  organizationId: string,
  updates: UpdateClinicProfileInput
): Promise<void> {
  const db = getAdminFirestore();
  const ref = db.collection(COLLECTIONS.CLINIC_PROFILES).doc(id);

  const doc = await ref.get();
  if (!doc.exists || doc.data()?.organizationId !== organizationId) {
    throw new Error("Clinic profile not found");
  }

  await ref.update({ ...updates, updatedAt: FieldValue.serverTimestamp() });
}
