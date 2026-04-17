import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { requireOrganization } from "@/lib/auth/clerk";
import { getPatientById } from "@/lib/data/patients";
import { PageShell } from "@/components/app/page-shell";
import { Button } from "@/components/ui/button";
import { updatePatientAction } from "../actions";

// ─── Field ────────────────────────────────────────────────────────────────────

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
  defaultValue,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
  defaultValue?: string | null;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={name} className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        defaultValue={defaultValue ?? ""}
        className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

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
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="First name"
              name="firstName"
              required
              placeholder="Jane"
              defaultValue={patient.firstName}
            />
            <Field
              label="Last name"
              name="lastName"
              required
              placeholder="Smith"
              defaultValue={patient.lastName}
            />
          </div>

          <Field
            label="Phone"
            name="phone"
            type="tel"
            required
            placeholder="+1 (555) 000-0000"
            defaultValue={patient.phone}
          />

          <Field
            label="Email"
            name="email"
            type="email"
            placeholder="jane@example.com"
            defaultValue={patient.email}
          />

          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Date of birth"
              name="dateOfBirth"
              type="date"
              defaultValue={patient.dateOfBirth}
            />
            <div className="space-y-1.5">
              <label
                htmlFor="gender"
                className="text-sm font-medium text-foreground"
              >
                Gender
              </label>
              <select
                id="gender"
                name="gender"
                defaultValue={patient.gender ?? ""}
                className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Select…</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="non-binary">Non-binary</option>
                <option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="notes"
              className="text-sm font-medium text-foreground"
            >
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={4}
              placeholder="Any relevant clinical or administrative notes…"
              defaultValue={patient.notes ?? ""}
              className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
            <Button asChild variant="outline" size="sm">
              <Link href={`/patients/${patientId}`}>Cancel</Link>
            </Button>
            <Button type="submit" size="sm">
              Save changes
            </Button>
          </div>
        </form>
      </div>
    </PageShell>
  );
}
