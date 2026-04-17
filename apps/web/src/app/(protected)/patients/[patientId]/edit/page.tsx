import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireOrganization } from "@/lib/auth/clerk";
import { getPatientById } from "@/lib/data/patients";
import { PageShell } from "@/components/app/page-shell";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/app/submit-button";
import { PatientFormFields } from "../../_components/patient-form-fields";
import { updatePatientAction } from "../actions";

export default async function EditPatientPage({
  params,
}: {
  params: Promise<{ patientId: string }>;
}) {
  const { patientId } = await params;
  const viewer = await requireOrganization();

  const patient = await getPatientById(patientId, viewer.orgId);
  if (!patient) notFound();

  const updateAction = updatePatientAction.bind(null, patientId);

  return (
    <PageShell
      title="Edit patient"
      description={`Editing record for ${patient.fullName}`}
      actions={
        <Button asChild variant="ghost" size="sm">
          <Link href={`/patients/${patientId}`}>
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back
          </Link>
        </Button>
      }
    >
      <div className="max-w-lg">
        <form action={updateAction} className="space-y-5">
          <PatientFormFields defaultValues={patient} />
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
            <Button asChild variant="outline" size="sm">
              <Link href={`/patients/${patientId}`}>Cancel</Link>
            </Button>
            <SubmitButton label="Save changes" />
          </div>
        </form>
      </div>
    </PageShell>
  );
}
