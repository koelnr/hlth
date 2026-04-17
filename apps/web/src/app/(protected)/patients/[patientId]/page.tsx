import type { ElementType, ReactNode } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Edit,
  Phone,
  Mail,
  Calendar,
  User,
  Clock,
} from "lucide-react";
import { requireOrganization } from "@/lib/auth/clerk";
import { getPatientById } from "@/lib/data/patients";
import { PageShell } from "@/components/app/page-shell";
import { Button } from "@/components/ui/button";
import { DeletePatientButton } from "./delete-patient-button";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(date: Date) {
  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatAge(dob: string): string {
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return `${age} yrs`;
}

function formatGender(gender: string): string {
  const map: Record<string, string> = {
    female: "Female",
    male: "Male",
    "non-binary": "Non-binary",
    "prefer-not-to-say": "Prefer not to say",
  };
  return map[gender] ?? gender;
}

// ─── Section components ───────────────────────────────────────────────────────

function Section({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="rounded-xl border border-border bg-card overflow-hidden">
      <div className="px-5 py-3.5 border-b border-border">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </p>
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: ElementType;
  label: string;
  value: string | null | undefined;
}) {
  if (!value) return null;
  return (
    <div className="flex items-start gap-3 py-2 first:pt-0 last:pb-0">
      <Icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm text-foreground">{value}</p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function PatientDetailPage({
  params,
}: {
  params: Promise<{ patientId: string }>;
}) {
  const { patientId } = await params;
  const viewer = await requireOrganization();

  const patient = await getPatientById(patientId, viewer.orgId);
  if (!patient) notFound();

  const dobDisplay = patient.dateOfBirth
    ? `${new Date(patient.dateOfBirth).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })} · ${formatAge(patient.dateOfBirth)}`
    : null;

  return (
    <PageShell
      title={patient.fullName}
      description="Patient record"
      actions={
        <div className="flex items-center gap-2">
          <Button asChild variant="ghost" size="sm">
            <Link href="/patients">
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              All patients
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href={`/patients/${patientId}/edit`}>
              <Edit className="h-4 w-4 mr-1.5" />
              Edit
            </Link>
          </Button>
          <DeletePatientButton
            patientId={patientId}
            patientName={patient.fullName}
          />
        </div>
      }
    >
      <div className="max-w-2xl space-y-4">
        {/* Contact */}
        <Section title="Contact">
          <InfoRow icon={Phone} label="Phone" value={patient.phone} />
          <InfoRow icon={Mail} label="Email" value={patient.email} />
        </Section>

        {/* Personal info */}
        <Section title="Patient information">
          <InfoRow
            icon={User}
            label="Full name"
            value={patient.fullName}
          />
          <InfoRow icon={Calendar} label="Date of birth" value={dobDisplay} />
          <InfoRow
            icon={User}
            label="Gender"
            value={patient.gender ? formatGender(patient.gender) : null}
          />
        </Section>

        {/* Notes */}
        <Section title="Notes">
          {patient.notes ? (
            <p className="text-sm text-foreground whitespace-pre-wrap leading-relaxed">
              {patient.notes}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground">No notes recorded.</p>
          )}
        </Section>

        {/* Metadata */}
        <Section title="Record">
          <InfoRow
            icon={Clock}
            label="Added"
            value={formatDate(patient.createdAt)}
          />
          <InfoRow
            icon={Clock}
            label="Last updated"
            value={formatDate(patient.updatedAt)}
          />
        </Section>

        {/* Future tabs placeholder — appointments, follow-ups, documents */}
        {/* These sections will be added as separate route segments */}
      </div>
    </PageShell>
  );
}
