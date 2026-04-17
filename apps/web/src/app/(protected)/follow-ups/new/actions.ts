"use server";

import { requireOrganization } from "@/lib/auth/clerk";
import { createFollowUp } from "@/lib/data/follow-ups";
import { getPatientById } from "@/lib/data/patients";
import { getAppointmentById } from "@/lib/data/appointments";
import { redirect } from "next/navigation";

export async function createFollowUpAction(formData: FormData) {
  const viewer = await requireOrganization();

  const patientId = formData.get("patientId") as string;
  if (!patientId) throw new Error("Patient is required");

  const dueDate = formData.get("dueDate") as string;
  if (!dueDate) throw new Error("Due date is required");

  const note = (formData.get("note") as string)?.trim() || null;
  const rawAppointmentId = (formData.get("appointmentId") as string)?.trim();
  const appointmentId = rawAppointmentId || null;

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

  const followUp = await createFollowUp(viewer.orgId, {
    patientId,
    dueAt: new Date(dueDate),
    status: "pending",
    note,
    appointmentId,
    createdByUserId: viewer.userId,
  });

  redirect(`/follow-ups/${followUp.id}`);
}
