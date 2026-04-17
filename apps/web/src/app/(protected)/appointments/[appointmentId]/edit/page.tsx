import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireOrganization } from "@/lib/auth/clerk";
import { getAppointmentById } from "@/lib/data/appointments";
import { listPatientsForOrg } from "@/lib/data/patients";
import { PageShell } from "@/components/app/page-shell";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/app/submit-button";
import { updateAppointmentAction } from "../actions";
import { AppointmentFormFields } from "../../_components/appointment-form-fields";
import type { Patient } from "@/lib/data/models";

function toDateInput(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function toTimeInput(date: Date): string {
  const h = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${h}:${min}`;
}

export default async function EditAppointmentPage({
  params,
}: {
  params: Promise<{ appointmentId: string }>;
}) {
  const { appointmentId } = await params;
  const viewer = await requireOrganization();

  const [appt, patients] = await Promise.all([
    getAppointmentById(appointmentId, viewer.orgId),
    listPatientsForOrg(viewer.orgId).catch((): Patient[] => []),
  ]);

  if (!appt) notFound();

  const updateAction = updateAppointmentAction.bind(null, appointmentId);

  return (
    <PageShell
      title="Edit appointment"
      description="Reschedule or update appointment details"
      actions={
        <Button asChild variant="ghost" size="sm">
          <Link href={`/appointments/${appointmentId}`}>
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back
          </Link>
        </Button>
      }
    >
      <div className="max-w-lg">
        <form action={updateAction} className="space-y-5">
          <AppointmentFormFields
            patients={patients}
            defaultValues={{
              patientId: appt.patientId,
              scheduledDate: toDateInput(appt.scheduledAt),
              scheduledTime: toTimeInput(appt.scheduledAt),
              durationMinutes: appt.durationMinutes,
              status: appt.status,
              reason: appt.reason,
              notes: appt.notes,
            }}
            showStatus
          />
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
            <Button asChild variant="outline" size="sm">
              <Link href={`/appointments/${appointmentId}`}>Cancel</Link>
            </Button>
            <SubmitButton label="Save changes" />
          </div>
        </form>
      </div>
    </PageShell>
  );
}
