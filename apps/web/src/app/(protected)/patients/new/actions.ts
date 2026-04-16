"use server";

import { requireOrganization } from "@/lib/auth/clerk";
import { createPatient } from "@/lib/data/patients";
import { redirect } from "next/navigation";

export async function createPatientAction(formData: FormData) {
  const viewer = await requireOrganization();

  const firstName = (formData.get("firstName") as string).trim();
  const lastName = (formData.get("lastName") as string).trim();
  const phone = (formData.get("phone") as string).trim();
  const email = (formData.get("email") as string)?.trim() || undefined;
  const dateOfBirth = (formData.get("dateOfBirth") as string) || undefined;
  const gender = (formData.get("gender") as string) || undefined;

  await createPatient(viewer.orgId, {
    firstName,
    lastName,
    phone,
    email,
    dateOfBirth,
    gender,
    createdByUserId: viewer.userId,
  });

  redirect("/patients");
}
