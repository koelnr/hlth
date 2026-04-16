/**
 * Clinic profile repository.
 *
 * One ClinicProfile per Clerk organization. Created during onboarding
 * after the org is set up in Clerk.
 */

import { FieldValue, Timestamp } from "firebase-admin/firestore";
import { getAdminFirestore } from "../firebase/admin";
import { COLLECTIONS } from "../firebase/collections";
import { baseFromDoc, toDate } from "./converters";
import type {
  ClinicProfile,
  CreateClinicProfileInput,
  UpdateClinicProfileInput,
} from "./models";

function fromDoc(doc: FirebaseFirestore.DocumentSnapshot): ClinicProfile {
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
 * Should be called once during onboarding.
 */
export async function createClinicProfile(
  input: CreateClinicProfileInput
): Promise<ClinicProfile> {
  const db = getAdminFirestore();
  const ref = db.collection(COLLECTIONS.CLINIC_PROFILES).doc();
  const now = Timestamp.now();

  const data = {
    ...input,
    createdAt: now,
    updatedAt: now,
  };

  await ref.set(data);

  return {
    ...input,
    id: ref.id,
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

  // Verify ownership before writing
  const doc = await ref.get();
  if (!doc.exists || doc.data()?.organizationId !== organizationId) {
    throw new Error("Clinic profile not found");
  }

  await ref.update({
    ...updates,
    updatedAt: FieldValue.serverTimestamp(),
  });
}
