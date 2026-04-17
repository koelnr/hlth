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
import { createFollowUpAction } from "./actions";
import type { Patient, Appointment } from "@/lib/data/models";

export default async function NewFollowUpPage() {
  const viewer = await requireOrganization();

  let patients: Patient[] = [];
  let appointments: Appointment[] = [];

  try {
    [patients, appointments] = await Promise.all([
      listPatientsForOrg(viewer.orgId),
      listAppointmentsForOrg(viewer.orgId),
    ]);
  } catch {
    // Firebase not configured
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
            appointments={appointments}
            defaultValues={{ dueDate: defaultDueDate }}
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
