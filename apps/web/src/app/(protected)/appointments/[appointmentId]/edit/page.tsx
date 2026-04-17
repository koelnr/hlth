import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireOrganization } from "@/lib/auth/clerk";
import { getAppointmentById } from "@/lib/data/appointments";
import { listPatientsForOrg } from "@/lib/data/patients";
import { PageShell } from "@/components/app/page-shell";
import { Button } from "@/components/ui/button";
import { updateAppointmentAction } from "../actions";
import type { Patient, Appointment } from "@/lib/data/models";

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

// ─── Field ────────────────────────────────────────────────────────────────────

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
  defaultValue?: string | null;
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
        defaultValue={defaultValue ?? ""}
        className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}

const STATUS_OPTIONS: { value: Appointment["status"]; label: string }[] = [
  { value: "scheduled", label: "Scheduled" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
  { value: "no_show", label: "No show" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

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

  const scheduledDate = toDateInput(appt.scheduledAt);
  const scheduledTime = toTimeInput(appt.scheduledAt);

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
          {/* Patient */}
          <div className="space-y-1.5">
            <label
              htmlFor="patientId"
              className="text-sm font-medium text-foreground"
            >
              Patient <span className="text-destructive">*</span>
            </label>
            <select
              id="patientId"
              name="patientId"
              required
              defaultValue={appt.patientId}
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
              defaultValue={scheduledDate}
            />
            <Field
              label="Time"
              name="scheduledTime"
              type="time"
              required
              defaultValue={scheduledTime}
            />
          </div>

          {/* Duration */}
          <div className="space-y-1.5">
            <label
              htmlFor="durationMinutes"
              className="text-sm font-medium text-foreground"
            >
              Duration <span className="text-destructive">*</span>
            </label>
            <select
              id="durationMinutes"
              name="durationMinutes"
              required
              defaultValue={String(appt.durationMinutes)}
              className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="15">15 minutes</option>
              <option value="30">30 minutes</option>
              <option value="45">45 minutes</option>
              <option value="60">60 minutes</option>
              <option value="90">90 minutes</option>
            </select>
          </div>

          {/* Status */}
          <div className="space-y-1.5">
            <label
              htmlFor="status"
              className="text-sm font-medium text-foreground"
            >
              Status <span className="text-destructive">*</span>
            </label>
            <select
              id="status"
              name="status"
              required
              defaultValue={appt.status}
              className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {STATUS_OPTIONS.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <Field
            label="Reason for visit"
            name="reason"
            placeholder="e.g. Annual checkup, follow-up…"
            defaultValue={appt.reason}
          />

          <div className="space-y-1.5">
            <label
              htmlFor="notes"
              className="text-sm font-medium text-foreground"
            >
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={3}
              placeholder="Any additional notes…"
              defaultValue={appt.notes ?? ""}
              className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
            <Button asChild variant="outline" size="sm">
              <Link href={`/appointments/${appointmentId}`}>Cancel</Link>
            </Button>
            <Button type="submit" size="sm">
              Save changes
            </Button>
          </div>
        </form>
      </div>
    </PageShell>
  );
}
