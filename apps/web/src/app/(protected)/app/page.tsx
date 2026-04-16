import { Suspense } from "react";
import { requireOrganization } from "@/lib/auth/clerk";
import { listPatientsForOrg } from "@/lib/data/patients";
import { listAppointmentsInRange } from "@/lib/data/appointments";
import { listPendingFollowUps } from "@/lib/data/follow-ups";
import { PageShell } from "@/components/app/page-shell";
import { OverviewCard } from "@/components/app/overview-card";
import { EmptyState } from "@/components/app/empty-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Calendar,
  ClipboardList,
  AlertCircle,
} from "lucide-react";
import type { Appointment, FollowUp } from "@/lib/data/models";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function getTodayRange(): { start: Date; end: Date } {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
  return { start, end };
}

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function appointmentStatusLabel(status: Appointment["status"]): string {
  const labels: Record<Appointment["status"], string> = {
    scheduled: "Scheduled",
    completed: "Completed",
    cancelled: "Cancelled",
    no_show: "No show",
  };
  return labels[status];
}

// ─── Data component ───────────────────────────────────────────────────────────

async function DashboardData({ orgId }: { orgId: string }) {
  let patients: Awaited<ReturnType<typeof listPatientsForOrg>> = [];
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
          <p className="text-sm font-medium text-foreground">
            Dashboard data unavailable
          </p>
          <p className="text-sm text-muted-foreground mt-0.5">
            Ensure Firebase environment variables are configured to load live
            data.
          </p>
        </div>
      </div>
    );
  }

  const patientNames = new Map(patients.map((p) => [p.id, p.fullName]));

  const todayLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
  });

  return (
    <>
      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
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
      </div>

      {/* Detail panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's appointments */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-foreground">
              Today's Appointments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todayAppointments.length === 0 ? (
              <EmptyState
                icon={Calendar}
                title="No appointments today"
                description="Nothing scheduled for today."
              />
            ) : (
              <div className="divide-y divide-border">
                {todayAppointments.slice(0, 6).map((appt) => (
                  <div
                    key={appt.id}
                    className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {patientNames.get(appt.patientId) ?? `Patient …${appt.patientId.slice(-6)}`}
                      </p>
                      {appt.reason && (
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {appt.reason}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-4">
                      <span className="text-xs text-muted-foreground">
                        {formatTime(appt.scheduledAt)}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {appointmentStatusLabel(appt.status)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pending follow-ups */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-foreground">
              Pending Follow-ups
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pendingFollowUps.length === 0 ? (
              <EmptyState
                icon={ClipboardList}
                title="No pending follow-ups"
                description="All follow-ups are up to date."
              />
            ) : (
              <div className="divide-y divide-border">
                {pendingFollowUps.slice(0, 6).map((followUp) => (
                  <div
                    key={followUp.id}
                    className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">
                        {patientNames.get(followUp.patientId) ?? `Patient …${followUp.patientId.slice(-6)}`}
                      </p>
                      {followUp.note && (
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {followUp.note}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3 shrink-0 ml-4">
                      <span className="text-xs text-muted-foreground">
                        Due {formatDate(followUp.dueAt)}
                      </span>
                      <Badge variant="outline" className="text-xs">
                        Pending
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-28 rounded-xl bg-muted animate-pulse" />
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="h-72 rounded-xl bg-muted animate-pulse" />
        <div className="h-72 rounded-xl bg-muted animate-pulse" />
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function DashboardPage() {
  const viewer = await requireOrganization();

  return (
    <PageShell
      title="Dashboard"
      description="An overview of your clinic's activity"
    >
      <Suspense fallback={<DashboardSkeleton />}>
        <DashboardData orgId={viewer.orgId} />
      </Suspense>
    </PageShell>
  );
}
