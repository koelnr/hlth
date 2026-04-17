"use server";

import { requireOrganization } from "@/lib/auth/clerk";
import { createPatient } from "@/lib/data/patients";
import { redirect } from "next/navigation";

export async function createPatientAction(formData: FormData) {
  const viewer = await requireOrganization();

  const firstName = (formData.get("firstName") as string).trim();
  const lastName = (formData.get("lastName") as string).trim();
  const phone = (formData.get("phone") as string).trim();
  const email = (formData.get("email") as string)?.trim() || null;
  const dateOfBirth = (formData.get("dateOfBirth") as string) || null;
  const gender = (formData.get("gender") as string) || null;
  const notes = (formData.get("notes") as string)?.trim() || null;

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
