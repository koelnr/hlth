import Link from "next/link";
import { requireOrganization } from "@/lib/auth/clerk";
import { listFollowUpsByOrganization } from "@/lib/data/follow-ups";
import { listPatientsForOrg } from "@/lib/data/patients";
import { PageShell } from "@/components/app/page-shell";
import { EmptyState } from "@/components/app/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ClipboardList, Plus, ChevronRight } from "lucide-react";
import type { FollowUp } from "@/lib/data/models";

// ─── Urgency grouping ─────────────────────────────────────────────────────────

type GroupKey = "overdue" | "dueToday" | "upcoming" | "completed" | "cancelled";

interface Groups {
  overdue: FollowUp[];
  dueToday: FollowUp[];
  upcoming: FollowUp[];
  completed: FollowUp[];
  cancelled: FollowUp[];
}

function groupFollowUps(followUps: FollowUp[]): Groups {
  const now = new Date();
  // Use UTC day boundaries — dueAt is stored as UTC midnight so comparisons
  // must stay in UTC to avoid off-by-one errors in negative-offset timezones.
  const todayUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const tomorrowUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1);

  const groups: Groups = { overdue: [], dueToday: [], upcoming: [], completed: [], cancelled: [] };

  for (const f of followUps) {
    if (f.status === "completed") {
      groups.completed.push(f);
    } else if (f.status === "cancelled") {
      groups.cancelled.push(f);
    } else if (f.dueAt.getTime() < todayUTC) {
      groups.overdue.push(f);
    } else if (f.dueAt.getTime() < tomorrowUTC) {
      groups.dueToday.push(f);
    } else {
      groups.upcoming.push(f);
    }
  }

  return groups;
}

// ─── Section ──────────────────────────────────────────────────────────────────

function SectionHeader({
  label,
  count,
  variant = "default",
}: {
  label: string;
  count: number;
  variant?: "destructive" | "warning" | "default" | "muted";
}) {
  const colorMap = {
    destructive: "text-destructive",
    warning: "text-amber-600 dark:text-amber-400",
    default: "text-foreground",
    muted: "text-muted-foreground",
  };

  return (
    <div className="px-4 py-2.5 border-b border-border bg-muted/20 flex items-center justify-between">
      <p className={`text-xs font-semibold uppercase tracking-wide ${colorMap[variant]}`}>
        {label}
      </p>
      <span className="text-xs text-muted-foreground">{count}</span>
    </div>
  );
}

// ─── Row ──────────────────────────────────────────────────────────────────────

const STATUS_LABELS: Record<string, string> = {
  pending: "Pending",
  completed: "Completed",
  cancelled: "Cancelled",
};

function formatDueDate(date: Date): string {
  // timeZone: "UTC" matches how dueAt is stored (UTC midnight) to avoid
  // off-by-one errors in negative-offset timezones.
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
}

function FollowUpRow({
  followUp,
  patientName,
  showStatus = false,
}: {
  followUp: FollowUp;
  patientName: string;
  showStatus?: boolean;
}) {
  const now = new Date();
  const todayUTC = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  const isOverdue = followUp.status === "pending" && followUp.dueAt.getTime() < todayUTC;

  return (
    <Link
      href={`/follow-ups/${followUp.id}`}
      className="flex items-center gap-3 px-4 py-3 hover:bg-muted/30 transition-colors border-b border-border last:border-0 group"
    >
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground">{patientName}</p>
        {followUp.note && (
          <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-xs">
            {followUp.note}
          </p>
        )}
      </div>
      <div className="shrink-0 text-right hidden sm:block">
        <p className={`text-xs ${isOverdue ? "text-destructive font-medium" : "text-muted-foreground"}`}>
          {formatDueDate(followUp.dueAt)}
        </p>
        {isOverdue && (
          <p className="text-xs text-destructive mt-0.5">Overdue</p>
        )}
      </div>
      {showStatus && (
        <Badge variant="outline" className="text-xs shrink-0">
          {STATUS_LABELS[followUp.status] ?? followUp.status}
        </Badge>
      )}
      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
    </Link>
  );
}

// ─── Group section ────────────────────────────────────────────────────────────

function FollowUpSection({
  label,
  followUps,
  patientNames,
  variant,
  showStatus = false,
}: {
  label: string;
  followUps: FollowUp[];
  patientNames: Map<string, string>;
  variant: "destructive" | "warning" | "default" | "muted";
  showStatus?: boolean;
}) {
  if (followUps.length === 0) return null;

  return (
    <div className="rounded-lg border border-border overflow-hidden">
      <SectionHeader label={label} count={followUps.length} variant={variant} />
      {followUps.map((f) => (
        <FollowUpRow
          key={f.id}
          followUp={f}
          patientName={patientNames.get(f.patientId) ?? `Patient …${f.patientId.slice(-6)}`}
          showStatus={showStatus}
        />
      ))}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function FollowUpsPage() {
  const viewer = await requireOrganization();

  let followUps: FollowUp[] = [];
  let patientNames = new Map<string, string>();
  let loadError = false;

  try {
    const [followUpData, patients] = await Promise.all([
      listFollowUpsByOrganization(viewer.orgId),
      listPatientsForOrg(viewer.orgId),
    ]);
    followUps = followUpData;
    patientNames = new Map(patients.map((p) => [p.id, p.fullName]));
  } catch (err) {
    console.error("[FollowUpsPage] Failed to load follow-ups:", err);
    loadError = true;
  }

  const groups = groupFollowUps(followUps);
  const hasPending =
    groups.overdue.length > 0 || groups.dueToday.length > 0 || groups.upcoming.length > 0;
  const hasAny = followUps.length > 0;

  return (
    <PageShell
      title="Follow-ups"
      description="Track and manage patient follow-up tasks"
      actions={
        <Button asChild size="sm">
          <Link href="/follow-ups/new">
            <Plus className="h-4 w-4 mr-1.5" />
            New follow-up
          </Link>
        </Button>
      }
    >
      {loadError ? (
        <EmptyState
          icon={ClipboardList}
          title="Unable to load follow-ups"
          description="Something went wrong while fetching data. Please refresh the page or try again later."
        />
      ) : !hasAny ? (
        <EmptyState
          icon={ClipboardList}
          title="No follow-ups yet"
          description="Create follow-up tasks to track patient care actions, reminders, and next steps after visits."
          action={
            <Button asChild size="sm">
              <Link href="/follow-ups/new">
                <Plus className="h-4 w-4 mr-1.5" />
                New follow-up
              </Link>
            </Button>
          }
        />
      ) : (
        <div className="space-y-6">
          {/* Pending groups */}
          {hasPending && (
            <div className="space-y-4">
              <FollowUpSection
                label="Overdue"
                followUps={groups.overdue}
                patientNames={patientNames}
                variant="destructive"
              />
              <FollowUpSection
                label="Due today"
                followUps={groups.dueToday}
                patientNames={patientNames}
                variant="warning"
              />
              <FollowUpSection
                label="Upcoming"
                followUps={groups.upcoming}
                patientNames={patientNames}
                variant="default"
              />
            </div>
          )}

          {/* Resolved groups */}
          {(groups.completed.length > 0 || groups.cancelled.length > 0) && (
            <div className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Resolved
              </p>
              <FollowUpSection
                label="Completed"
                followUps={groups.completed}
                patientNames={patientNames}
                variant="muted"
                showStatus
              />
              <FollowUpSection
                label="Cancelled"
                followUps={groups.cancelled}
                patientNames={patientNames}
                variant="muted"
                showStatus
              />
            </div>
          )}
        </div>
      )}
    </PageShell>
  );
}
