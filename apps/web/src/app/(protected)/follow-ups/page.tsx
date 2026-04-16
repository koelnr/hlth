import Link from "next/link";
import { requireOrganization } from "@/lib/auth/clerk";
import { listPendingFollowUps } from "@/lib/data/follow-ups";
import { listPatientsForOrg } from "@/lib/data/patients";
import { PageShell } from "@/components/app/page-shell";
import { EmptyState } from "@/components/app/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ClipboardList, Plus } from "lucide-react";
import type { FollowUp } from "@/lib/data/models";

// ─── Row component ────────────────────────────────────────────────────────────

function FollowUpRow({
  followUp,
  patientName,
}: {
  followUp: FollowUp;
  patientName: string;
}) {
  const isOverdue = followUp.dueAt < new Date() && followUp.status === "pending";

  return (
    <tr className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
      <td className="px-4 py-3">
        <p className="text-sm font-medium text-foreground">{patientName}</p>
        {followUp.note && (
          <p className="text-xs text-muted-foreground mt-0.5 truncate max-w-[200px]">
            {followUp.note}
          </p>
        )}
      </td>
      <td className="px-4 py-3 hidden sm:table-cell">
        <p
          className={`text-sm ${isOverdue ? "text-destructive font-medium" : "text-muted-foreground"}`}
        >
          {followUp.dueAt.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
        {isOverdue && <p className="text-xs text-destructive mt-0.5">Overdue</p>}
      </td>
      <td className="px-4 py-3">
        <Badge variant="outline" className="text-xs">
          {followUp.status.charAt(0).toUpperCase() + followUp.status.slice(1)}
        </Badge>
      </td>
    </tr>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function FollowUpsPage() {
  const viewer = await requireOrganization();

  let followUps: FollowUp[] = [];
  let patientNames = new Map<string, string>();

  try {
    const [followUpData, patients] = await Promise.all([
      listPendingFollowUps(viewer.orgId),
      listPatientsForOrg(viewer.orgId),
    ]);
    followUps = followUpData;
    patientNames = new Map(patients.map((p) => [p.id, p.fullName]));
  } catch {
    // Firebase not yet configured — render empty state below
  }

  return (
    <PageShell
      title="Follow-ups"
      description="Track and manage pending patient follow-ups"
      actions={
        <Button asChild size="sm">
          <Link href="/follow-ups/new">
            <Plus className="h-4 w-4 mr-1.5" />
            Add Follow-up
          </Link>
        </Button>
      }
    >
      {/* Status filter placeholder */}
      <div className="flex items-center gap-3 mb-6">
        <Button variant="outline" size="sm" disabled className="text-xs">
          Pending
        </Button>
        <Button variant="outline" size="sm" disabled className="text-xs">
          All statuses
        </Button>
      </div>

      {/* Follow-ups list */}
      {followUps.length === 0 ? (
        <EmptyState
          icon={ClipboardList}
          title="No pending follow-ups"
          description="Follow-ups will appear here once created for a patient or appointment."
          action={
            <Button asChild size="sm">
              <Link href="/follow-ups/new">
                <Plus className="h-4 w-4 mr-1.5" />
                Add Follow-up
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
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">
                  Due Date
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {followUps.map((followUp) => (
                <FollowUpRow
                  key={followUp.id}
                  followUp={followUp}
                  patientName={
                    patientNames.get(followUp.patientId) ??
                    `Patient …${followUp.patientId.slice(-6)}`
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
