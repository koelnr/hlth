"use server";

import { requireOrganization } from "@/lib/auth/clerk";
import { createPatient } from "@/lib/data/patients";
import { redirect } from "next/navigation";

export async function createPatientAction(formData: FormData) {
  const viewer = await requireOrganization();

  // Null-safe extraction — formData.get() returns null for missing fields;
  // the TypeScript cast does not coerce at runtime.
  const firstName = ((formData.get("firstName") as string) ?? "").trim();
  const lastName = ((formData.get("lastName") as string) ?? "").trim();
  const phone = ((formData.get("phone") as string) ?? "").trim();
  const email = ((formData.get("email") as string) ?? "").trim() || null;
  const dateOfBirth = (formData.get("dateOfBirth") as string) || null;
  const gender = (formData.get("gender") as string) || null;
  const notes = ((formData.get("notes") as string) ?? "").trim() || null;

  if (!firstName || !lastName || !phone) {
    throw new Error("First name, last name, and phone are required");
  }

  await createPatient(viewer.orgId, {
    firstName,
    lastName,
    phone,
    email,
    dateOfBirth,
    gender,
    notes,
    createdByUserId: viewer.userId,
  });

  redirect("/patients");
}
