import Link from "next/link";
import { ArrowLeft, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/app/submit-button";
import { PageShell } from "@/components/app/page-shell";
import { EmptyState } from "@/components/app/empty-state";
import { requireOrganization } from "@/lib/auth/clerk";
import { listPatientsForOrg } from "@/lib/data/patients";
import { createAppointmentAction } from "./actions";
import { AppointmentFormFields } from "../_components/appointment-form-fields";
import type { Patient } from "@/lib/data/models";

export default async function NewAppointmentPage() {
  const viewer = await requireOrganization();

  let patients: Patient[] = [];
  try {
    patients = await listPatientsForOrg(viewer.orgId);
  } catch {
    // Firebase not configured
  }

  if (patients.length === 0) {
    return (
      <PageShell
        title="Schedule Appointment"
        description="Book an appointment for a patient"
        actions={
          <Button asChild variant="ghost" size="sm">
            <Link href="/appointments">
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              Back
            </Link>
          </Button>
        }
      >
        <EmptyState
          icon={Users}
          title="No patients found"
          description="Add at least one patient before scheduling an appointment."
          action={
            <Button asChild size="sm">
              <Link href="/patients/new">Add Patient</Link>
            </Button>
          }
        />
      </PageShell>
    );
  }

  // Default date/time: round up to next 30-min boundary using local time components.
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  if (now.getMinutes() < 30) {
    now.setMinutes(30, 0, 0);
  } else {
    now.setMinutes(0, 0, 0);
    now.setHours(now.getHours() + 1);
  }
  const defaultDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  const defaultTime = `${pad(now.getHours())}:${pad(now.getMinutes())}`;

  return (
    <PageShell
      title="Schedule Appointment"
      description="Book an appointment for a patient"
      actions={
        <Button asChild variant="ghost" size="sm">
          <Link href="/appointments">
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back
          </Link>
        </Button>
      }
    >
      <div className="max-w-lg">
        <form action={createAppointmentAction} className="space-y-5">
          <AppointmentFormFields
            patients={patients}
            defaultValues={{ scheduledDate: defaultDate, scheduledTime: defaultTime }}
          />
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
            <Button asChild variant="outline" size="sm">
              <Link href="/appointments">Cancel</Link>
            </Button>
            <SubmitButton label="Schedule Appointment" pendingLabel="Scheduling…" />
          </div>
        </form>
      </div>
    </PageShell>
  );
}
