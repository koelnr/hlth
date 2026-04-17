"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireOrganization } from "@/lib/auth/clerk";
import { updateFollowUp, deleteFollowUp } from "@/lib/data/follow-ups";
import { getPatientById } from "@/lib/data/patients";
import { getAppointmentById } from "@/lib/data/appointments";
import type { FollowUpStatus } from "@/lib/data/models";

const VALID_STATUSES: FollowUpStatus[] = ["pending", "completed", "cancelled"];

export async function updateFollowUpAction(
  followUpId: string,
  formData: FormData
): Promise<void> {
  const viewer = await requireOrganization();

  const patientId = formData.get("patientId") as string;
  if (!patientId) throw new Error("Patient is required");

  const dueDate = formData.get("dueDate") as string;
  if (!dueDate) throw new Error("Due date is required");

  const rawStatus = formData.get("status") as string;
  if (!VALID_STATUSES.includes(rawStatus as FollowUpStatus)) {
    throw new Error("Invalid status");
  }
  const status = rawStatus as FollowUpStatus;

  const rawAppointmentId = (formData.get("appointmentId") as string)?.trim();
  const appointmentId = rawAppointmentId || null;

  const note = (formData.get("note") as string)?.trim() || null;

  // Verify patient belongs to this organization
  const patient = await getPatientById(patientId, viewer.orgId);
  if (!patient) throw new Error("Patient not found in this organization");

  // If appointmentId provided, verify it belongs to org and matches patient
  if (appointmentId) {
    const appt = await getAppointmentById(appointmentId, viewer.orgId);
    if (!appt) throw new Error("Appointment not found in this organization");
    if (appt.patientId !== patientId) {
      throw new Error("Appointment does not belong to the selected patient");
    }
  }

  await updateFollowUp(followUpId, viewer.orgId, {
    patientId,
    dueAt: new Date(dueDate),
    status,
    appointmentId,
    note,
  });

  redirect(`/follow-ups/${followUpId}`);
}

/**
 * Quick status update — called from the detail page status buttons.
 * Uses revalidatePath so the page refreshes in place without full navigation.
 */
export async function updateFollowUpStatusAction(
  followUpId: string,
  status: FollowUpStatus
): Promise<void> {
  if (!VALID_STATUSES.includes(status)) throw new Error("Invalid status");
  const viewer = await requireOrganization();
  await updateFollowUp(followUpId, viewer.orgId, { status });
  revalidatePath(`/follow-ups/${followUpId}`);
  revalidatePath("/follow-ups");
}

export async function deleteFollowUpAction(followUpId: string): Promise<void> {
  const viewer = await requireOrganization();
  await deleteFollowUp(followUpId, viewer.orgId);
  redirect("/follow-ups");
}
