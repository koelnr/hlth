import { Suspense } from "react";
import Link from "next/link";
import { requireOrganization } from "@/lib/auth/clerk";
import { listPatientsForOrg } from "@/lib/data/patients";
import { listAppointmentsInRange } from "@/lib/data/appointments";
import { listPendingFollowUps } from "@/lib/data/follow-ups";
import { PageShell } from "@/components/app/page-shell";
import { OverviewCard } from "@/components/app/overview-card";
import { EmptyState } from "@/components/app/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Users,
  Calendar,
  ClipboardList,
  AlertCircle,
  AlertTriangle,
  Plus,
  ChevronRight,
} from "lucide-react";
import type { Appointment, FollowUp, Patient } from "@/lib/data/models";
import { AppointmentRowActions } from "./_components/appointment-row-actions";

// ─── Date helpers ──────────────────────────────────────────────────────────────

function getTodayRange(): { start: Date; end: Date } {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
  return { start, end };
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function formatDueDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

function formatCreatedDate(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

// ─── Follow-up classification ──────────────────────────────────────────────────

function classifyFollowUps(followUps: FollowUp[]): {
  overdueIds: Set<string>;
  overdue: FollowUp[];
  dueToday: FollowUp[];
} {
  const now = new Date();
  const todayUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const tomorrowUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1);

  const overdue: FollowUp[] = [];
  const dueToday: FollowUp[] = [];

  for (const f of followUps) {
    if (f.dueAt.getTime() < todayUTC) {
      overdue.push(f);
    } else if (f.dueAt.getTime() < tomorrowUTC) {
      dueToday.push(f);
    }
  }

  return {
    overdueIds: new Set(overdue.map((f) => f.id)),
    overdue,
    dueToday,
  };
}

// ─── Section header ────────────────────────────────────────────────────────────

function SectionHeader({
  title,
  href,
  showLink,
}: {
  title: string;
  href: string;
  showLink: boolean;
}) {
  return (
    <CardHeader className="pb-3">
      <div className="flex items-center justify-between">
        <CardTitle className="text-sm font-medium text-foreground">{title}</CardTitle>
        {showLink && (
          <Button asChild variant="ghost" size="sm" className="h-7 px-2 text-xs text-muted-foreground">
            <Link href={href}>View all</Link>
          </Button>
        )}
      </div>
    </CardHeader>
  );
}

// ─── Data component ───────────────────────────────────────────────────────────

async function DashboardData({ orgId }: { orgId: string }) {
  let patients: Patient[] = [];
  let todayAppointments: Appointment[] = [];
  let pendingFollowUps: FollowUp[] = [];
  let dataError = false;

  try {
    const { start, end } = getTodayRange();
    [patients, todayAppointments, pendingFollowUps] = await Promise.all([
      listPatientsForOrg(orgId),
      listAppointmentsInRange(orgId, start, end),
      listPendingFollowUps(orgId),
    ]);
  } catch {
    dataError = true;
  }

  if (dataError) {
    return (
      <div className="rounded-lg border border-border bg-muted/30 p-5 flex items-start gap-3">
        <AlertCircle className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-foreground">Dashboard data unavailable</p>
          <p className="text-sm text-muted-foreground mt-0.5">
            Ensure Firebase environment variables are configured to load live data.
          </p>
        </div>
      </div>
    );
  }

  const patientNames = new Map(patients.map((p) => [p.id, p.fullName]));
  const { overdueIds, overdue, dueToday } = classifyFollowUps(pendingFollowUps);
  const overdueCount = overdue.length;
  const recentPatients = patients.slice(0, 5);

  // Overdue first, then due today — capped at 8 for dashboard
  const attentionFollowUps = [...overdue, ...dueToday].slice(0, 8);

  const todayLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <>
      {/* ── Summary cards ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        <OverviewCard
          title="Total Patients"
          value={patients.length}
          icon={Users}
          description="Registered in your clinic"
        />
        <OverviewCard
          title="Today's Appointments"
          value={todayAppointments.length}
          icon={Calendar}
          description={todayLabel}
        />
        <OverviewCard
          title="Pending Follow-ups"
          value={pendingFollowUps.length}
          icon={ClipboardList}
          description="Awaiting action"
        />
        <OverviewCard
          title="Overdue Follow-ups"
          value={overdueCount}
          icon={AlertTriangle}
          description={overdueCount > 0 ? "Needs immediate attention" : "None overdue"}
          className={overdueCount > 0 ? "border-destructive/40" : undefined}
        />
      </div>

      {/* ── Main grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

        {/* Today's appointments */}
        <Card>
          <SectionHeader
            title="Today's Appointments"
            href="/appointments"
            showLink={todayAppointments.length > 0}
          />
          <CardContent className="p-0">
            {todayAppointments.length === 0 ? (
              <div className="px-6 pb-6">
                <EmptyState
                  icon={Calendar}
                  title="No appointments today"
                  description="Nothing scheduled for today."
                  action={
                    <Button asChild size="sm" variant="outline">
                      <Link href="/appointments/new">
                        <Plus className="h-3.5 w-3.5 mr-1.5" />
                        Schedule appointment
                      </Link>
                    </Button>
                  }
                />
              </div>
            ) : (
              <div>
                {todayAppointments.slice(0, 8).map((appt) => (
                  <div
                    key={appt.id}
                    className="flex items-center gap-3 px-6 py-3 hover:bg-muted/30 transition-colors border-b border-border last:border-0 group"
                  >
                    <Link
                      href={`/appointments/${appt.id}`}
                      className="flex-1 min-w-0"
                    >
                      <p className="text-sm font-medium text-foreground truncate">
                        {patientNames.get(appt.patientId) ??
                          `Patient …${appt.patientId.slice(-6)}`}
                      </p>
                      {appt.reason && (
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {appt.reason}
                        </p>
                      )}
                    </Link>
                    <div className="flex items-center gap-2.5 shrink-0">
                      <span className="text-xs text-muted-foreground tabular-nums">
                        {formatTime(appt.scheduledAt)}
                      </span>
                      <AppointmentRowActions
                        appointmentId={appt.id}
                        initialStatus={appt.status}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Follow-ups needing attention */}
        <Card>
          <SectionHeader
            title="Follow-ups Needing Attention"
            href="/follow-ups"
            showLink={attentionFollowUps.length > 0}
          />
          <CardContent className="p-0">
            {attentionFollowUps.length === 0 ? (
              <div className="px-6 pb-6">
                <EmptyState
                  icon={ClipboardList}
                  title={
                    pendingFollowUps.length > 0
                      ? "No urgent follow-ups"
                      : "No pending follow-ups"
                  }
                  description={
                    pendingFollowUps.length > 0
                      ? "All pending follow-ups are scheduled for future dates."
                      : "All follow-ups are up to date."
                  }
                />
              </div>
            ) : (
              <div>
                {attentionFollowUps.map((f) => {
                  const isOverdue = overdueIds.has(f.id);
                  return (
                    <Link
                      key={f.id}
                      href={`/follow-ups/${f.id}`}
                      className="flex items-center gap-3 px-6 py-3 hover:bg-muted/30 transition-colors border-b border-border last:border-0 group"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">
                          {patientNames.get(f.patientId) ??
                            `Patient …${f.patientId.slice(-6)}`}
                        </p>
                        {f.note && (
                          <p className="text-xs text-muted-foreground truncate mt-0.5">
                            {f.note}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2.5 shrink-0">
                        <div className="text-right hidden sm:block">
                          <p
                            className={`text-xs font-medium ${
                              isOverdue
                                ? "text-destructive"
                                : "text-amber-600 dark:text-amber-400"
                            }`}
                          >
                            {isOverdue ? "Overdue" : "Due today"}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            {formatDueDate(f.dueAt)}
                          </p>
                        </div>
                        <ChevronRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Recent patients ── */}
      <Card>
        <SectionHeader
          title="Recent Patients"
          href="/patients"
          showLink={patients.length > 0}
        />
        <CardContent className="p-0">
          {recentPatients.length === 0 ? (
            <div className="px-6 pb-6">
              <EmptyState
                icon={Users}
                title="No patients yet"
                description="Add your first patient to get started."
                action={
                  <Button asChild size="sm" variant="outline">
                    <Link href="/patients/new">
                      <Plus className="h-3.5 w-3.5 mr-1.5" />
                      Add patient
                    </Link>
                  </Button>
                }
              />
            </div>
          ) : (
            <div>
              {recentPatients.map((p) => (
                <Link
                  key={p.id}
                  href={`/patients/${p.id}`}
                  className="flex items-center gap-3 px-6 py-3 hover:bg-muted/30 transition-colors border-b border-border last:border-0 group"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{p.fullName}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">
                      {p.phone}
                      {p.email ? ` · ${p.email}` : ""}
                    </p>
                  </div>
                  <div className="flex items-center gap-2.5 shrink-0">
                    <span className="text-xs text-muted-foreground hidden sm:inline">
                      Added {formatCreatedDate(p.createdAt)}
                    </span>
                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="h-28 rounded-xl bg-muted animate-pulse" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-64 rounded-xl bg-muted animate-pulse" />
        <div className="h-64 rounded-xl bg-muted animate-pulse" />
      </div>
      <div className="h-48 rounded-xl bg-muted animate-pulse" />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function DashboardPage() {
  const viewer = await requireOrganization();

  return (
    <PageShell
      title="Dashboard"
      description="What needs attention today"
      actions={
        <div className="flex items-center gap-2">
          <Button asChild size="sm" variant="outline" className="hidden sm:flex">
            <Link href="/patients/new">
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              Add patient
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="hidden sm:flex">
            <Link href="/appointments/new">
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              New appointment
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/follow-ups/new">
              <Plus className="h-3.5 w-3.5 mr-1.5" />
              New follow-up
            </Link>
          </Button>
        </div>
      }
    >
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardData orgId={viewer.orgId} />
      </Suspense>
    </PageShell>
  );
}
