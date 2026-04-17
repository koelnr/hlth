"use server";

import { requireOrganization } from "@/lib/auth/clerk";
import { updatePatient, deletePatient } from "@/lib/data/patients";
import { redirect } from "next/navigation";

export async function updatePatientAction(
  patientId: string,
  formData: FormData
): Promise<void> {
  const viewer = await requireOrganization();

  const firstName = (formData.get("firstName") as string).trim();
  const lastName = (formData.get("lastName") as string).trim();
  const phone = (formData.get("phone") as string).trim();
  const email = (formData.get("email") as string)?.trim() || null;
  const dateOfBirth = (formData.get("dateOfBirth") as string) || null;
  const gender = (formData.get("gender") as string) || null;
  const notes = (formData.get("notes") as string)?.trim() || null;

  await updatePatient(patientId, viewer.orgId, {
    firstName,
    lastName,
    phone,
    email,
    dateOfBirth,
    gender,
    notes,
  });

  redirect(`/patients/${patientId}`);
}

export async function deletePatientAction(patientId: string): Promise<void> {
  const viewer = await requireOrganization();
  await deletePatient(patientId, viewer.orgId);
  redirect("/patients");
}
