import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireOrganization } from "@/lib/auth/clerk";
import { getFollowUpById } from "@/lib/data/follow-ups";
import { listPatientsForOrg } from "@/lib/data/patients";
import { listAppointmentsForOrg } from "@/lib/data/appointments";
import { PageShell } from "@/components/app/page-shell";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/app/submit-button";
import { FollowUpFormFields } from "../../_components/follow-up-form-fields";
import type { PatientOption, AppointmentOption } from "../../_components/follow-up-form-fields";
import { updateFollowUpAction } from "../actions";
import type { Patient, Appointment } from "@/lib/data/models";

function toDateInput(date: Date): string {
  // dueAt is stored as UTC midnight — use UTC methods to avoid off-by-one
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function formatApptDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function EditFollowUpPage({
  params,
}: {
  params: Promise<{ followUpId: string }>;
}) {
  const { followUpId } = await params;
  const viewer = await requireOrganization();

  const [followUp, patientData, appointmentData] = await Promise.all([
    getFollowUpById(followUpId, viewer.orgId),
    listPatientsForOrg(viewer.orgId).catch((): Patient[] => []),
    listAppointmentsForOrg(viewer.orgId).catch((): Appointment[] => []),
  ]);

  if (!followUp) notFound();

  const patients: PatientOption[] = patientData.map((p) => ({
    id: p.id,
    fullName: p.fullName,
  }));
  const appointmentOptions: AppointmentOption[] = appointmentData.map((a) => ({
    id: a.id,
    patientId: a.patientId,
    label: formatApptDate(a.scheduledAt),
  }));

  const updateAction = updateFollowUpAction.bind(null, followUpId);

  return (
    <PageShell
      title="Edit follow-up"
      description="Update the follow-up details"
      actions={
        <Button asChild variant="ghost" size="sm">
          <Link href={`/follow-ups/${followUpId}`}>
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back
          </Link>
        </Button>
      }
    >
      <div className="max-w-lg">
        <form action={updateAction} className="space-y-5">
          <FollowUpFormFields
            patients={patients}
            appointmentOptions={appointmentOptions}
            defaultValues={{
              patientId: followUp.patientId,
              dueDate: toDateInput(followUp.dueAt),
              appointmentId: followUp.appointmentId,
              note: followUp.note,
              status: followUp.status,
            }}
            showStatus
          />
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
            <Button asChild variant="outline" size="sm">
              <Link href={`/follow-ups/${followUpId}`}>Cancel</Link>
            </Button>
            <SubmitButton label="Save changes" />
          </div>
        </form>
      </div>
    </PageShell>
  );
}
