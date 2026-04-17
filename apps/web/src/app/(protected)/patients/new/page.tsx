import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageShell } from "@/components/app/page-shell";
import { createPatientAction } from "./actions";

function Field({
  label,
  name,
  type = "text",
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <div className="space-y-1.5">
      <label
        htmlFor={name}
        className="text-sm font-medium text-foreground"
      >
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}

export default function NewPatientPage() {
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
          <div className="grid grid-cols-2 gap-4">
            <Field label="First name" name="firstName" required placeholder="Jane" />
            <Field label="Last name" name="lastName" required placeholder="Smith" />
          </div>
          <Field
            label="Phone"
            name="phone"
            type="tel"
            required
            placeholder="+1 (555) 000-0000"
          />
          <Field
            label="Email"
            name="email"
            type="email"
            placeholder="jane@example.com"
          />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Date of birth" name="dateOfBirth" type="date" />
            <div className="space-y-1.5">
              <label htmlFor="gender" className="text-sm font-medium text-foreground">
                Gender
              </label>
              <select
                id="gender"
                name="gender"
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
            <label htmlFor="notes" className="text-sm font-medium text-foreground">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              rows={4}
              placeholder="Any relevant clinical or administrative notes…"
              className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
            <Button asChild variant="outline" size="sm">
              <Link href="/patients">Cancel</Link>
            </Button>
            <Button type="submit" size="sm">
              Save Patient
            </Button>
          </div>
        </form>
      </div>
    </PageShell>
  );
}
