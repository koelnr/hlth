"use server";

import { requireOrganization } from "@/lib/auth/clerk";
import { createFollowUp } from "@/lib/data/follow-ups";
import { redirect } from "next/navigation";

export async function createFollowUpAction(formData: FormData) {
  const viewer = await requireOrganization();

  const patientId = formData.get("patientId") as string;
  const dueDate = formData.get("dueDate") as string;
  const note = (formData.get("note") as string)?.trim() || undefined;

  await createFollowUp(viewer.orgId, {
    patientId,
    dueAt: new Date(dueDate),
    status: "pending",
    note,
    createdByUserId: viewer.userId,
  });

  redirect("/follow-ups");
}
