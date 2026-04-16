import { requireOrganization } from "@/lib/auth/clerk";
import { listPatientsForOrg } from "@/lib/data/patients";
import { PageShell } from "@/components/app/page-shell";
import { EmptyState } from "@/components/app/empty-state";
import { Button } from "@/components/ui/button";
import { Users, Plus, Search } from "lucide-react";
import type { Patient } from "@/lib/data/models";

// ─── Patients list ────────────────────────────────────────────────────────────

function PatientRow({ patient }: { patient: Patient }) {
  return (
    <tr className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
      <td className="px-4 py-3">
        <p className="text-sm font-medium text-foreground">{patient.fullName}</p>
      </td>
      <td className="px-4 py-3 hidden sm:table-cell">
        <p className="text-sm text-muted-foreground">{patient.email ?? "—"}</p>
      </td>
      <td className="px-4 py-3 hidden md:table-cell">
        <p className="text-sm text-muted-foreground">{patient.phone}</p>
      </td>
      <td className="px-4 py-3">
        <p className="text-sm text-muted-foreground">
          {patient.createdAt.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </td>
    </tr>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function PatientsPage() {
  const viewer = await requireOrganization();

  let patients: Patient[] = [];
  try {
    patients = await listPatientsForOrg(viewer.orgId);
  } catch {
    // Firebase not yet configured — render empty state below
  }

  return (
    <PageShell
      title="Patients"
      description="View and manage your clinic's patient records"
      actions={
        // TODO: wire to create patient flow
        <Button size="sm" disabled>
          <Plus className="h-4 w-4 mr-1.5" />
          Add Patient
        </Button>
      }
    >
      {/* Search / filter bar */}
      <div className="flex items-center gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search patients…"
            disabled
            className="w-full pl-9 pr-4 py-2 text-sm border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      {/* Patient list */}
      {patients.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No patients yet"
          description="Add your first patient to begin tracking their care and appointments."
          action={
            // TODO: wire to create patient flow
            <Button size="sm" disabled>
              <Plus className="h-4 w-4 mr-1.5" />
              Add Patient
            </Button>
          }
        />
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">
                  Phone
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Added
                </th>
              </tr>
            </thead>
            <tbody>
              {patients.map((patient) => (
                <PatientRow key={patient.id} patient={patient} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </PageShell>
  );
}
