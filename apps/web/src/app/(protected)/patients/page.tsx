import Link from "next/link";
import { requireOrganization } from "@/lib/auth/clerk";
import { listPatientsForOrg } from "@/lib/data/patients";
import { PageShell } from "@/components/app/page-shell";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { PatientsList } from "./_components/patients-list";
import type { PatientListItem } from "./_components/patients-list";

export default async function PatientsPage() {
  const viewer = await requireOrganization();

  let patients: PatientListItem[] = [];
  try {
    const data = await listPatientsForOrg(viewer.orgId);
    patients = data.map((p) => ({
      id: p.id,
      fullName: p.fullName,
      phone: p.phone,
      email: p.email,
      createdAtDisplay: p.createdAt.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
    }));
  } catch {
    // Firebase not yet configured — render empty state below
  }

  return (
    <PageShell
      title="Patients"
      description="View and manage your clinic's patient records"
      actions={
        <Button asChild size="sm">
          <Link href="/patients/new">
            <Plus className="h-4 w-4 mr-1.5" />
            Add Patient
          </Link>
        </Button>
      }
    >
      <PatientsList patients={patients} />
    </PageShell>
  );
}
