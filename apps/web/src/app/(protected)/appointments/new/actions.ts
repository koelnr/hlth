"use server";

import { requireOrganization } from "@/lib/auth/clerk";
import { createAppointment } from "@/lib/data/appointments";
import { getPatientById } from "@/lib/data/patients";
import { redirect } from "next/navigation";

export async function createAppointmentAction(formData: FormData) {
  const viewer = await requireOrganization();

  const patientId = formData.get("patientId") as string;
  if (!patientId) throw new Error("Patient is required");

  const scheduledDate = formData.get("scheduledDate") as string;
  const scheduledTime = formData.get("scheduledTime") as string;
  const durationMinutes = parseInt(
    formData.get("durationMinutes") as string,
    10,
  );
  if (!Number.isFinite(durationMinutes) || durationMinutes <= 0) {
    throw new Error("Invalid duration");
  }
  const reason = (formData.get("reason") as string)?.trim() || null;
  const notes = (formData.get("notes") as string)?.trim() || null;

  // Verify patient belongs to this organization before creating
  const patient = await getPatientById(patientId, viewer.orgId);
  if (!patient) {
    throw new Error("Patient not found in this organization");
  }

  const scheduledAt = new Date(`${scheduledDate}T${scheduledTime}`);

  await createAppointment(viewer.orgId, {
    patientId,
    scheduledAt,
    durationMinutes,
    status: "scheduled",
    reason,
    notes,
    createdByUserId: viewer.userId,
    clinicianUserId: null,
  });

  redirect("/appointments");
}
