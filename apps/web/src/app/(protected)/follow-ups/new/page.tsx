import Link from "next/link";
import { ArrowLeft, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/app/page-shell";
import { EmptyState } from "@/components/app/empty-state";
import { SubmitButton } from "@/components/app/submit-button";
import { requireOrganization } from "@/lib/auth/clerk";
import { listPatientsForOrg } from "@/lib/data/patients";
import { listAppointmentsForOrg } from "@/lib/data/appointments";
import { FollowUpFormFields } from "../_components/follow-up-form-fields";
import type { PatientOption, AppointmentOption } from "../_components/follow-up-form-fields";
import { createFollowUpAction } from "./actions";

function formatApptDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default async function NewFollowUpPage({
  searchParams,
}: {
  searchParams: Promise<{ patientId?: string; appointmentId?: string }>;
}) {
  const viewer = await requireOrganization();
  const { patientId: defaultPatientId, appointmentId: defaultAppointmentId } =
    await searchParams;

  let patients: PatientOption[] = [];
  let appointmentOptions: AppointmentOption[] = [];

  try {
    const [patientData, appointmentData] = await Promise.all([
      listPatientsForOrg(viewer.orgId),
      listAppointmentsForOrg(viewer.orgId),
    ]);
    patients = patientData.map((p) => ({ id: p.id, fullName: p.fullName }));
    appointmentOptions = appointmentData.map((a) => ({
      id: a.id,
      patientId: a.patientId,
      label: formatApptDate(a.scheduledAt),
    }));
  } catch (err) {
    console.error("[NewFollowUpPage] Failed to load data:", err);
  }

  // Default due date to 7 days from today
  const defaultDue = new Date();
  defaultDue.setDate(defaultDue.getDate() + 7);
  const defaultDueDate = defaultDue.toISOString().split("T")[0];

  if (patients.length === 0) {
    return (
      <PageShell
        title="New follow-up"
        description="Create a follow-up task for a patient"
        actions={
          <Button asChild variant="ghost" size="sm">
            <Link href="/follow-ups">
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              Back
            </Link>
          </Button>
        }
      >
        <EmptyState
          icon={Users}
          title="No patients found"
          description="Add at least one patient before creating a follow-up."
          action={
            <Button asChild size="sm">
              <Link href="/patients/new">Add patient</Link>
            </Button>
          }
        />
      </PageShell>
    );
  }

  return (
    <PageShell
      title="New follow-up"
      description="Create a follow-up task for a patient"
      actions={
        <Button asChild variant="ghost" size="sm">
          <Link href="/follow-ups">
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back
          </Link>
        </Button>
      }
    >
      <div className="max-w-lg">
        <form action={createFollowUpAction} className="space-y-5">
          <FollowUpFormFields
            patients={patients}
            appointmentOptions={appointmentOptions}
            defaultValues={{
              dueDate: defaultDueDate,
              patientId: defaultPatientId,
              appointmentId: defaultAppointmentId,
            }}
          />
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
            <Button asChild variant="outline" size="sm">
              <Link href="/follow-ups">Cancel</Link>
            </Button>
            <SubmitButton label="Create follow-up" />
          </div>
        </form>
      </div>
    </PageShell>
  );
}
