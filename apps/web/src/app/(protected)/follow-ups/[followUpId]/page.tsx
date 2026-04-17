import type { ElementType, ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Edit, Clock, User, FileText, Calendar, ClipboardList } from "lucide-react";
import { requireOrganization } from "@/lib/auth/clerk";
import { getFollowUpById } from "@/lib/data/follow-ups";
import { getPatientById } from "@/lib/data/patients";
import { getAppointmentById } from "@/lib/data/appointments";
import { PageShell } from "@/components/app/page-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StatusActions } from "./status-actions";
import { DeleteFollowUpButton } from "./delete-follow-up-button";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDueDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatMeta(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatApptDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

// ─── Section components ───────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: ReactNode }) {
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

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  completed: "Completed",
  cancelled: "Cancelled",
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function FollowUpDetailPage({
  params,
}: {
  params: Promise<{ followUpId: string }>;
}) {
  const { followUpId } = await params;
  const viewer = await requireOrganization();

  const followUp = await getFollowUpById(followUpId, viewer.orgId);
  if (!followUp) notFound();

  const [patient, appointment] = await Promise.all([
    getPatientById(followUp.patientId, viewer.orgId),
    followUp.appointmentId
      ? getAppointmentById(followUp.appointmentId, viewer.orgId)
      : Promise.resolve(null),
  ]);

  const patientName = patient?.fullName ?? `Patient …${followUp.patientId.slice(-6)}`;

  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const isOverdue = followUp.status === "pending" && followUp.dueAt < startOfToday;

  return (
    <PageShell
      title={patientName}
      description={`Follow-up · Due ${formatDueDate(followUp.dueAt)}`}
      actions={
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/follow-ups">
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              All follow-ups
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={`/follow-ups/${followUpId}/edit`}>
              <Edit className="h-4 w-4 mr-1.5" />
              Edit
            </Link>
          </Button>
          <DeleteFollowUpButton followUpId={followUpId} patientName={patientName} />
        </div>
      }
    >
      <div className="max-w-2xl space-y-4">
        {/* Status */}
        <Section title="Status">
          <StatusActions followUpId={followUpId} currentStatus={followUp.status} />
        </Section>

        {/* Due date */}
        <Section title="Follow-up task">
          <div className="flex items-start gap-3 py-0">
            <Clock className={`h-4 w-4 mt-0.5 shrink-0 ${isOverdue ? "text-destructive" : "text-muted-foreground"}`} />
            <div>
              <p className="text-xs text-muted-foreground">Due</p>
              <p className={`text-sm ${isOverdue ? "text-destructive font-medium" : "text-foreground"}`}>
                {formatDueDate(followUp.dueAt)}
                {isOverdue && " · Overdue"}
              </p>
            </div>
          </div>
          {followUp.note && (
            <div className="flex items-start gap-3 py-2">
              <FileText className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Note</p>
                <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
                  {followUp.note}
                </p>
              </div>
            </div>
          )}
          {!followUp.note && (
            <div className="flex items-start gap-3 py-2">
              <FileText className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Note</p>
                <p className="text-sm text-muted-foreground">No note recorded.</p>
              </div>
            </div>
          )}
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

        {/* Linked appointment */}
        {appointment && (
          <Section title="Linked appointment">
            <div className="flex items-start gap-3 py-0">
              <Calendar className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Date</p>
                <Link
                  href={`/appointments/${appointment.id}`}
                  className="text-sm text-foreground hover:text-primary hover:underline underline-offset-2"
                >
                  {formatApptDate(appointment.scheduledAt)}
                </Link>
              </div>
            </div>
            {appointment.reason && (
              <div className="flex items-start gap-3 py-2">
                <ClipboardList className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">Reason</p>
                  <p className="text-sm text-foreground">{appointment.reason}</p>
                </div>
              </div>
            )}
            <div className="flex items-start gap-3 py-2">
              <Clock className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-muted-foreground">Status</p>
                <Badge variant="outline" className="text-xs mt-0.5">
                  {appointment.status.replace("_", " ")}
                </Badge>
              </div>
            </div>
          </Section>
        )}

        {/* Record metadata */}
        <Section title="Record">
          <InfoRow icon={Clock} label="Created" value={formatMeta(followUp.createdAt)} />
          <InfoRow icon={Clock} label="Last updated" value={formatMeta(followUp.updatedAt)} />
        </Section>
      </div>
    </PageShell>
  );
}
