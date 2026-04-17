import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/app/page-shell";
import { SubmitButton } from "@/components/app/submit-button";
import { requireOrganization } from "@/lib/auth/clerk";
import { PatientFormFields } from "../_components/patient-form-fields";
import { createPatientAction } from "./actions";

export default async function NewPatientPage() {
  await requireOrganization();

  return (
    <PageShell
      title="Add Patient"
      description="Register a new patient in your clinic"
      actions={
        <Button asChild variant="ghost" size="sm">
          <Link href="/patients">
            <ArrowLeft className="h-4 w-4 mr-1.5" />
            Back
          </Link>
        </Button>
      }
    >
      <div className="max-w-lg">
        <form action={createPatientAction} className="space-y-5">
          <PatientFormFields />
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
            <Button asChild variant="outline" size="sm">
              <Link href="/patients">Cancel</Link>
            </Button>
            <SubmitButton label="Save Patient" />
          </div>
        </form>
      </div>
    </PageShell>
  );
}
