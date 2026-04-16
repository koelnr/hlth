import Link from "next/link";
import { ArrowLeft, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/app/page-shell";
import { EmptyState } from "@/components/app/empty-state";
import { requireOrganization } from "@/lib/auth/clerk";
import { listPatientsForOrg } from "@/lib/data/patients";
import { createFollowUpAction } from "./actions";
import type { Patient } from "@/lib/data/models";

export default async function NewFollowUpPage() {
  const viewer = await requireOrganization();

  let patients: Patient[] = [];
  try {
    patients = await listPatientsForOrg(viewer.orgId);
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
        title="Add Follow-up"
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
              <Link href="/patients/new">Add Patient</Link>
            </Button>
          }
        />
      </PageShell>
    );
  }

  return (
    <PageShell
      title="Add Follow-up"
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
          {/* Patient */}
          <div className="space-y-1.5">
            <label htmlFor="patientId" className="text-sm font-medium text-foreground">
              Patient <span className="text-destructive">*</span>
            </label>
            <select
              id="patientId"
              name="patientId"
              required
              className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="">Select patient…</option>
              {patients.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.fullName}
                </option>
              ))}
            </select>
          </div>

          {/* Due date */}
          <div className="space-y-1.5">
            <label htmlFor="dueDate" className="text-sm font-medium text-foreground">
              Due date <span className="text-destructive">*</span>
            </label>
            <input
              id="dueDate"
              name="dueDate"
              type="date"
              required
              defaultValue={defaultDueDate}
              className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          {/* Note */}
          <div className="space-y-1.5">
            <label htmlFor="note" className="text-sm font-medium text-foreground">
              Note
            </label>
            <textarea
              id="note"
              name="note"
              rows={3}
              placeholder="What should be followed up on?"
              className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
            <Button asChild variant="outline" size="sm">
              <Link href="/follow-ups">Cancel</Link>
            </Button>
            <Button type="submit" size="sm">
              Save Follow-up
            </Button>
          </div>
        </form>
      </div>
    </PageShell>
  );
}
