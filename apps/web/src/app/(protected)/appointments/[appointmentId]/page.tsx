import type { ElementType, ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Edit, Clock, User, FileText, Calendar, ClipboardList } from "lucide-react";
import { requireOrganization } from "@/lib/auth/clerk";
import { getAppointmentById } from "@/lib/data/appointments";
import { getPatientById } from "@/lib/data/patients";
import { PageShell } from "@/components/app/page-shell";
import { Button } from "@/components/ui/button";
import { DeleteAppointmentButton } from "./delete-appointment-button";
import { StatusActions } from "./status-actions";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDateTime(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatMeta(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

// ─── Section components ───────────────────────────────────────────────────────

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="px-5 py-3.5 border-b border-border">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </p>
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: ElementType;
  label: string;
  value: string | null | undefined;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-2 first:pt-0 last:pb-0">
      <Icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm text-foreground">{value}</p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function AppointmentDetailPage({
  params,
}: {
  params: Promise<{ appointmentId: string }>;
}) {
  const { appointmentId } = await params;
  const viewer = await requireOrganization();

  const appt = await getAppointmentById(appointmentId, viewer.orgId);
  if (!appt) notFound();

  const patient = await getPatientById(appt.patientId, viewer.orgId);

  const patientName = patient?.fullName ?? `Patient …${appt.patientId.slice(-6)}`;

  return (
    <PageShell
      title={formatDateTime(appt.scheduledAt)}
      description={patientName}
      actions={
        <div className="flex items-center gap-2 flex-wrap">
          <Button asChild variant="ghost" size="sm">
            <Link href="/appointments">
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              All appointments
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link
              href={`/follow-ups/new?patientId=${appt.patientId}&appointmentId=${appointmentId}`}
            >
              <ClipboardList className="h-4 w-4 mr-1.5" />
              Create follow-up
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={`/appointments/${appointmentId}/edit`}>
              <Edit className="h-4 w-4 mr-1.5" />
              Edit
            </Link>
          </Button>
          <DeleteAppointmentButton
            appointmentId={appointmentId}
            patientName={patientName}
          />
        </div>
      }
    >
      <div className="max-w-2xl space-y-4">
        {/* Status */}
        <Section title="Status">
          <StatusActions
            appointmentId={appointmentId}
            currentStatus={appt.status}
          />
        </Section>

        {/* Appointment details */}
        <Section title="Appointment">
          <InfoRow
            icon={Calendar}
            label="Date"
            value={formatDateTime(appt.scheduledAt)}
          />
          <InfoRow
            icon={Clock}
            label="Time"
            value={formatTime(appt.scheduledAt)}
          />
          <InfoRow
            icon={Clock}
            label="Duration"
            value={`${appt.durationMinutes} minutes`}
          />
        </Section>

        {/* Patient */}
        <Section title="Patient">
          <div className="flex items-start gap-3 py-0">
            <User className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
            <div>
              <p className="text-xs text-muted-foreground">Name</p>
              {patient ? (
                <Link
                  href={`/patients/${patient.id}`}
                  className="text-sm text-foreground hover:text-primary hover:underline underline-offset-2"
                >
                  {patient.fullName}
                </Link>
              ) : (
                <p className="text-sm text-foreground">{patientName}</p>
              )}
            </div>
          </div>
        </Section>

        {/* Visit information */}
        <Section title="Visit information">
          {appt.reason || appt.notes ? (
            <>
              <InfoRow icon={FileText} label="Reason" value={appt.reason} />
              {appt.notes && (
                <div className="flex items-start gap-3 py-2 first:pt-0 last:pb-0">
                  <FileText className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Notes</p>
                    <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                      {appt.notes}
                    </p>
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">
              No reason or notes recorded.
            </p>
          )}
        </Section>

        {/* Record metadata */}
        <Section title="Record">
          <InfoRow
            icon={Clock}
            label="Created"
            value={formatMeta(appt.createdAt)}
          />
          <InfoRow
            icon={Clock}
            label="Last updated"
            value={formatMeta(appt.updatedAt)}
          />
        </Section>
      </div>
    </PageShell>
  );
}
