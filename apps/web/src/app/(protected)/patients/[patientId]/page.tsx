import type { ElementType, ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Edit,
  Phone,
  Mail,
  Calendar,
  User,
  Clock,
  Plus,
  ClipboardList,
  ChevronRight,
} from "lucide-react";
import { requireOrganization } from "@/lib/auth/clerk";
import { getPatientById } from "@/lib/data/patients";
import { listAppointmentsForPatient } from "@/lib/data/appointments";
import { listFollowUpsForPatient } from "@/lib/data/follow-ups";
import { PageShell } from "@/components/app/page-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DeletePatientButton } from "./delete-patient-button";
import type { Appointment, FollowUp } from "@/lib/data/models";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatAge(dob: string): string {
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return `${age} yrs`;
}

function formatGender(gender: string): string {
  const map: Record<string, string> = {
    female: "Female",
    male: "Male",
    "non-binary": "Non-binary",
    "prefer-not-to-say": "Prefer not to say",
  };
  return map[gender] ?? gender;
}

function formatApptDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatApptTime(date: Date): string {
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function formatDueDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

// ─── Appointment status helpers ───────────────────────────────────────────────

function apptStatusVariant(
  status: Appointment["status"],
): "default" | "secondary" | "outline" | "destructive" {
  if (status === "scheduled") return "default";
  if (status === "completed") return "secondary";
  if (status === "cancelled") return "destructive";
  return "outline";
}

function apptStatusLabel(status: Appointment["status"]): string {
  const labels: Record<Appointment["status"], string> = {
    scheduled: "Scheduled",
    completed: "Completed",
    cancelled: "Cancelled",
    no_show: "No show",
  };
  return labels[status];
}

// ─── Follow-up urgency helpers ────────────────────────────────────────────────

function getFollowUpUrgency(followUp: FollowUp): "overdue" | "today" | "upcoming" | "resolved" {
  if (followUp.status !== "pending") return "resolved";
  const now = new Date();
  const todayUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const tomorrowUTC = todayUTC + 86400000;
  if (followUp.dueAt.getTime() < todayUTC) return "overdue";
  if (followUp.dueAt.getTime() < tomorrowUTC) return "today";
  return "upcoming";
}

// ─── Section components ───────────────────────────────────────────────────────

function Section({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="px-5 py-3.5 border-b border-border flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </p>
        {action}
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

// ─── Related record rows ──────────────────────────────────────────────────────

function AppointmentItem({ appt }: { appt: Appointment }) {
  return (
    <Link
      href={`/appointments/${appt.id}`}
      className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0 hover:opacity-80 transition-opacity group"
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">
          {formatApptDate(appt.scheduledAt)}
          <span className="text-muted-foreground font-normal ml-2 text-xs">
            {formatApptTime(appt.scheduledAt)}
          </span>
        </p>
        {appt.reason && (
          <p className="text-xs text-muted-foreground mt-0.5 truncate">{appt.reason}</p>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Badge variant={apptStatusVariant(appt.status)} className="text-xs">
          {apptStatusLabel(appt.status)}
        </Badge>
        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </Link>
  );
}

function FollowUpItem({ followUp }: { followUp: FollowUp }) {
  const urgency = getFollowUpUrgency(followUp);
  const urgencyColors = {
    overdue: "text-destructive font-medium",
    today: "text-amber-600 dark:text-amber-400 font-medium",
    upcoming: "text-muted-foreground",
    resolved: "text-muted-foreground",
  };

  return (
    <Link
      href={`/follow-ups/${followUp.id}`}
      className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0 hover:opacity-80 transition-opacity group"
    >
      <div className="flex-1 min-w-0">
        <p className={`text-sm ${urgencyColors[urgency]}`}>
          Due {formatDueDate(followUp.dueAt)}
          {urgency === "overdue" && " · Overdue"}
          {urgency === "today" && " · Due today"}
        </p>
        {followUp.note && (
          <p className="text-xs text-muted-foreground mt-0.5 truncate">{followUp.note}</p>
        )}
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Badge variant="outline" className="text-xs capitalize">
          {followUp.status}
        </Badge>
        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function PatientDetailPage({
  params,
}: {
  params: Promise<{ patientId: string }>;
}) {
  const { patientId } = await params;
  const viewer = await requireOrganization();

  const [patient, appointments, followUps] = await Promise.all([
    getPatientById(patientId, viewer.orgId),
    listAppointmentsForPatient(viewer.orgId, patientId).catch(() => [] as Appointment[]),
    listFollowUpsForPatient(viewer.orgId, patientId).catch(() => [] as FollowUp[]),
  ]);

  if (!patient) notFound();

  const dobDisplay = patient.dateOfBirth
    ? `${new Date(patient.dateOfBirth).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })} · ${formatAge(patient.dateOfBirth)}`
    : null;

  // Split appointments into upcoming and past
  const now = new Date();
  const upcomingAppts = appointments
    .filter((a) => a.status === "scheduled" && a.scheduledAt >= now)
    .sort((a, b) => a.scheduledAt.getTime() - b.scheduledAt.getTime())
    .slice(0, 5);

  const pastAppts = appointments
    .filter((a) => a.status !== "scheduled" || a.scheduledAt < now)
    .sort((a, b) => b.scheduledAt.getTime() - a.scheduledAt.getTime())
    .slice(0, 5);

  // Split follow-ups into pending and resolved
  const pendingFollowUps = followUps
    .filter((f) => f.status === "pending")
    .sort((a, b) => a.dueAt.getTime() - b.dueAt.getTime())
    .slice(0, 5);

  const resolvedFollowUps = followUps
    .filter((f) => f.status !== "pending")
    .slice(0, 3);

  const allFollowUps = [...pendingFollowUps, ...resolvedFollowUps];

  return (
    <PageShell
      title={patient.fullName}
      description="Patient record"
      actions={
        <div className="flex items-center gap-2 flex-wrap">
          <Button asChild variant="ghost" size="sm">
            <Link href="/patients">
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              All patients
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={`/appointments/new?patientId=${patientId}`}>
              <Calendar className="h-4 w-4 mr-1.5" />
              New appointment
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={`/follow-ups/new?patientId=${patientId}`}>
              <ClipboardList className="h-4 w-4 mr-1.5" />
              New follow-up
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={`/patients/${patientId}/edit`}>
              <Edit className="h-4 w-4 mr-1.5" />
              Edit
            </Link>
          </Button>
          <DeletePatientButton
            patientId={patientId}
            patientName={patient.fullName}
          />
        </div>
      }
    >
      <div className="max-w-2xl space-y-4">
        {/* Contact */}
        <Section title="Contact">
          <InfoRow icon={Phone} label="Phone" value={patient.phone} />
          <InfoRow icon={Mail} label="Email" value={patient.email} />
        </Section>

        {/* Personal info */}
        <Section title="Patient information">
          <InfoRow icon={User} label="Full name" value={patient.fullName} />
          <InfoRow icon={Calendar} label="Date of birth" value={dobDisplay} />
          <InfoRow
            icon={User}
            label="Gender"
            value={patient.gender ? formatGender(patient.gender) : null}
          />
        </Section>

        {/* Notes */}
        <Section title="Notes">
          {patient.notes ? (
            <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
              {patient.notes}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">No notes recorded.</p>
          )}
        </Section>

        {/* Upcoming appointments */}
        <Section
          title="Upcoming appointments"
          action={
            <Button asChild variant="ghost" size="sm" className="h-7 px-2 text-xs">
              <Link href={`/appointments/new?patientId=${patientId}`}>
                <Plus className="h-3.5 w-3.5 mr-1" />
                Book
              </Link>
            </Button>
          }
        >
          {upcomingAppts.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No upcoming appointments.{" "}
              <Link
                href={`/appointments/new?patientId=${patientId}`}
                className="text-primary hover:underline underline-offset-2"
              >
                Book one
              </Link>
            </p>
          ) : (
            <div className="divide-y divide-border -mx-0">
              {upcomingAppts.map((appt) => (
                <AppointmentItem key={appt.id} appt={appt} />
              ))}
            </div>
          )}
        </Section>

        {/* Follow-ups */}
        <Section
          title="Follow-ups"
          action={
            <Button asChild variant="ghost" size="sm" className="h-7 px-2 text-xs">
              <Link href={`/follow-ups/new?patientId=${patientId}`}>
                <Plus className="h-3.5 w-3.5 mr-1" />
                Add
              </Link>
            </Button>
          }
        >
          {allFollowUps.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No follow-ups yet.{" "}
              <Link
                href={`/follow-ups/new?patientId=${patientId}`}
                className="text-primary hover:underline underline-offset-2"
              >
                Create one
              </Link>
            </p>
          ) : (
            <div className="divide-y divide-border">
              {allFollowUps.map((f) => (
                <FollowUpItem key={f.id} followUp={f} />
              ))}
            </div>
          )}
        </Section>

        {/* Past appointments */}
        {pastAppts.length > 0 && (
          <Section title="Past appointments">
            <div className="divide-y divide-border">
              {pastAppts.map((appt) => (
                <AppointmentItem key={appt.id} appt={appt} />
              ))}
            </div>
          </Section>
        )}

        {/* Metadata */}
        <Section title="Record">
          <InfoRow
            icon={Clock}
            label="Added"
            value={formatDate(patient.createdAt)}
          />
          <InfoRow
            icon={Clock}
            label="Last updated"
            value={formatDate(patient.updatedAt)}
          />
        </Section>
      </div>
    </PageShell>
  );
}
