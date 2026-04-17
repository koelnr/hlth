import { requireOrganization } from "@/lib/auth/clerk";
import { getClinicProfile } from "@/lib/data/clinics";
import { PageShell } from "@/components/app/page-shell";
import { SubmitButton } from "@/components/app/submit-button";
import { saveClinicSettingsAction } from "./actions";
import type { ClinicProfile } from "@/lib/data/models";

// ─── Helpers ──────────────────────────────────────────────────────────────────

const INPUT_CLASS =
  "w-full px-3 py-2 text-sm border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring";

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
        className={INPUT_CLASS}
      />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function SettingsPage() {
  const viewer = await requireOrganization();

  let profile: ClinicProfile | null = null;
  try {
    profile = await getClinicProfile(viewer.orgId);
  } catch {
    // Firebase not yet configured
  }

  const isNew = !profile;

  return (
    <PageShell
      title="Clinic settings"
      description="Manage your clinic's profile and contact information"
    >
      <div className="max-w-lg">
        <div className="rounded-xl border border-border bg-card overflow-hidden mb-6">
          <div className="px-5 py-3.5 border-b border-border">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Clinic profile
            </p>
          </div>
          <div className="px-5 py-5">
            <form action={saveClinicSettingsAction} className="space-y-5">
              {/* Hidden profile ID for update path */}
              {profile && (
                <input type="hidden" name="profileId" value={profile.id} />
              )}

              <Field
                label="Clinic name"
                name="name"
                required
                placeholder="e.g. City Family Clinic"
                defaultValue={profile?.name}
              />

              <Field
                label="Specialty"
                name="specialty"
                placeholder="e.g. General Practice, Cardiology…"
                defaultValue={profile?.specialty}
              />

              <Field
                label="Phone"
                name="phone"
                type="tel"
                placeholder="e.g. +1 555 000 0000"
                defaultValue={profile?.phone}
              />

              <Field
                label="Email"
                name="email"
                type="email"
                placeholder="e.g. contact@clinic.com"
                defaultValue={profile?.email}
              />

              <div className="space-y-1.5">
                <label htmlFor="address" className="text-sm font-medium text-foreground">
                  Address
                </label>
                <textarea
                  id="address"
                  name="address"
                  rows={2}
                  placeholder="e.g. 123 Main St, Suite 200, Chicago, IL 60601"
                  defaultValue={profile?.address ?? ""}
                  className="w-full px-3 py-2 text-sm border border-input rounded-lg bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-border">
                <SubmitButton
                  label={isNew ? "Save clinic profile" : "Save changes"}
                  pendingLabel="Saving…"
                />
              </div>
            </form>
          </div>
        </div>

        {profile && (
          <div className="rounded-xl border border-border bg-card overflow-hidden">
            <div className="px-5 py-3.5 border-b border-border">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Account
              </p>
            </div>
            <div className="px-5 py-4 space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Organization ID</p>
                <p className="text-sm text-foreground font-mono mt-0.5">{viewer.orgId}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </PageShell>
  );
}
