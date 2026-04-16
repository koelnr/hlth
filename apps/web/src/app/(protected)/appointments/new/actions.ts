"use server";

import { requireOrganization } from "@/lib/auth/clerk";
import { createAppointment } from "@/lib/data/appointments";
import { redirect } from "next/navigation";

export async function createAppointmentAction(formData: FormData) {
  const viewer = await requireOrganization();

  const patientId = formData.get("patientId") as string;
  const scheduledDate = formData.get("scheduledDate") as string;
  const scheduledTime = formData.get("scheduledTime") as string;
  const durationMinutes = parseInt(formData.get("durationMinutes") as string, 10);
  const reason = (formData.get("reason") as string)?.trim() || undefined;
  const notes = (formData.get("notes") as string)?.trim() || undefined;

  const scheduledAt = new Date(`${scheduledDate}T${scheduledTime}`);

  await createAppointment(viewer.orgId, {
    patientId,
    scheduledAt,
    durationMinutes,
    status: "scheduled",
    reason,
    notes,
    createdByUserId: viewer.userId,
  });

  redirect("/appointments");
}
