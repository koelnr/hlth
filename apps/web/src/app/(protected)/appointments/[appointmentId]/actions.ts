"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireOrganization } from "@/lib/auth/clerk";
import {
  updateAppointment,
  deleteAppointment,
} from "@/lib/data/appointments";
import { getPatientById } from "@/lib/data/patients";
import type { AppointmentStatus } from "@/lib/data/models";

const VALID_STATUSES: AppointmentStatus[] = [
  "scheduled",
  "completed",
  "cancelled",
  "no_show",
];

export async function updateAppointmentAction(
  appointmentId: string,
  formData: FormData,
): Promise<void> {
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
  const rawStatus = formData.get("status") as string;
  if (!VALID_STATUSES.includes(rawStatus as AppointmentStatus)) {
    throw new Error("Invalid status");
  }
  const status = rawStatus as AppointmentStatus;
  const reason = (formData.get("reason") as string)?.trim() || null;
  const notes = (formData.get("notes") as string)?.trim() || null;

  // Verify patient belongs to this organization
  const patient = await getPatientById(patientId, viewer.orgId);
  if (!patient) {
    throw new Error("Patient not found in this organization");
  }

  const scheduledAt = new Date(`${scheduledDate}T${scheduledTime}`);

  await updateAppointment(appointmentId, viewer.orgId, {
    patientId,
    scheduledAt,
    durationMinutes,
    status,
    reason,
    notes,
  });

  redirect(`/appointments/${appointmentId}`);
}

/**
 * Quick status update — called from the detail page status buttons.
 * Uses revalidatePath so the page refreshes in place without full navigation.
 */
export async function updateAppointmentStatusAction(
  appointmentId: string,
  status: AppointmentStatus,
): Promise<void> {
  if (!VALID_STATUSES.includes(status)) {
    throw new Error("Invalid status");
  }
  const viewer = await requireOrganization();
  await updateAppointment(appointmentId, viewer.orgId, { status });
  revalidatePath(`/appointments/${appointmentId}`);
  revalidatePath("/appointments");
  revalidatePath("/app");
}

export async function deleteAppointmentAction(
  appointmentId: string,
): Promise<void> {
  const viewer = await requireOrganization();
  await deleteAppointment(appointmentId, viewer.orgId);
  redirect("/appointments");
}
