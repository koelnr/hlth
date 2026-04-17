import Link from "next/link";
import { requireOrganization } from "@/lib/auth/clerk";
import { listAppointmentsForOrg } from "@/lib/data/appointments";
import { listPatientsForOrg } from "@/lib/data/patients";
import { PageShell } from "@/components/app/page-shell";
import { EmptyState } from "@/components/app/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Plus } from "lucide-react";
import type { Appointment } from "@/lib/data/models";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function statusLabel(status: Appointment["status"]): string {
  const labels: Record<Appointment["status"], string> = {
    scheduled: "Scheduled",
    completed: "Completed",
    cancelled: "Cancelled",
    no_show: "No show",
  };
  return labels[status];
}

function statusVariant(
  status: Appointment["status"],
): "default" | "secondary" | "outline" | "destructive" {
  if (status === "scheduled") return "default";
  if (status === "completed") return "secondary";
  if (status === "cancelled") return "destructive";
  return "outline";
}

// ─── Row component ────────────────────────────────────────────────────────────

function AppointmentRow({
  appt,
  patientName,
}: {
  appt: Appointment;
  patientName: string;
}) {
  return (
    <tr className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
      <td className="px-4 py-3">
        <Link
          href={`/appointments/${appt.id}`}
          className="text-sm font-medium text-foreground hover:text-primary hover:underline underline-offset-2"
        >
          {patientName}
        </Link>
      </td>
      <td className="px-4 py-3">
        <p className="text-sm text-foreground">
          {appt.scheduledAt.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5">
          {appt.scheduledAt.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
          })}
        </p>
      </td>
      <td className="px-4 py-3 hidden md:table-cell">
        <p className="text-sm text-muted-foreground">
          {appt.durationMinutes} min
        </p>
      </td>
      <td className="px-4 py-3 hidden sm:table-cell">
        <p className="text-sm text-muted-foreground truncate max-w-[180px]">
          {appt.reason ?? "—"}
        </p>
      </td>
      <td className="px-4 py-3">
        <Badge variant={statusVariant(appt.status)} className="text-xs">
          {statusLabel(appt.status)}
        </Badge>
      </td>
      <td className="px-4 py-3 text-right">
        <Link
          href={`/appointments/${appt.id}`}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          aria-label={`View appointment for ${patientName}`}
        >
          →
        </Link>
      </td>
    </tr>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AppointmentsPage() {
  const viewer = await requireOrganization();

  let appointments: Appointment[] = [];
  let patientNames = new Map<string, string>();

  try {
    const [appts, patients] = await Promise.all([
      listAppointmentsForOrg(viewer.orgId),
      listPatientsForOrg(viewer.orgId),
    ]);
    appointments = appts;
    patientNames = new Map(patients.map((p) => [p.id, p.fullName]));
  } catch {
    // Firebase not yet configured — render empty state below
  }

  return (
    <PageShell
      title="Appointments"
      description="View and manage scheduled appointments"
      actions={
        <Button asChild size="sm">
          <Link href="/appointments/new">
            <Plus className="h-4 w-4 mr-1.5" />
            New appointment
          </Link>
        </Button>
      }
    >
      {appointments.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No appointments yet"
          description="Schedule your first appointment to get started."
          action={
            <Button asChild size="sm">
              <Link href="/appointments/new">
                <Plus className="h-4 w-4 mr-1.5" />
                Schedule Appointment
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Patient
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Date &amp; Time
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">
                  Duration
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">
                  Reason
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Status
                </th>
                <th className="px-4 py-3 w-8" />
              </tr>
            </thead>
            <tbody>
              {appointments.map((appt) => (
                <AppointmentRow
                  key={appt.id}
                  appt={appt}
                  patientName={
                    patientNames.get(appt.patientId) ??
                    `Patient …${appt.patientId.slice(-6)}`
                  }
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PageShell>
  );
}
