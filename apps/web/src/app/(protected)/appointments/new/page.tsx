import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/app/page-shell";
import { requireOrganization } from "@/lib/auth/clerk";
import { listPatientsForOrg } from "@/lib/data/patients";
import { EmptyState } from "@/components/app/empty-state";
import { Users } from "lucide-react";
import { createAppointmentAction } from "./actions";
import type { Patient } from "@/lib/data/models";

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue}
        className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}

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

  // Default date/time to now (rounded to next 30 min)
  const now = new Date();
  now.setMinutes(now.getMinutes() < 30 ? 30 : 0);
  if (now.getMinutes() === 0) now.setHours(now.getHours() + 1);
  const defaultDate = now.toISOString().split("T")[0];
  const defaultTime = now.toTimeString().slice(0, 5);

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

          {/* Date + Time */}
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Date"
              name="scheduledDate"
              type="date"
              required
              defaultValue={defaultDate}
            />
            <Field
              label="Time"
              name="scheduledTime"
              type="time"
              required
              defaultValue={defaultTime}
            />
          </div>

          {/* Duration */}
          <div className="space-y-1.5">
            <label htmlFor="durationMinutes" className="text-sm font-medium text-foreground">
              Duration <span className="text-destructive">*</span>
            </label>
            <select
              id="durationMinutes"
              name="durationMinutes"
              required
              defaultValue="30"
              className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">60 minutes</option>
              <option value="90">90 minutes</option>
            </select>
          </div>

          <Field
            label="Reason for visit"
            name="reason"
            placeholder="e.g. Annual checkup, follow-up…"
          />

          <div className="space-y-1.5">
            <label htmlFor="notes" className="text-sm font-medium text-foreground">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              placeholder="Any additional notes…"
              className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
            <Button asChild variant="outline" size="sm">
              <Link href="/appointments">Cancel</Link>
            </Button>
            <Button type="submit" size="sm">
              Schedule Appointment
            </Button>
          </div>
        </form>
      </div>
    </PageShell>
  );
}
