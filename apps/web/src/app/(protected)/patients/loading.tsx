import { PageShell } from "@/components/app/page-shell";

export default function Loading() {
  return (
    <PageShell
      title="Patients"
      description="View and manage your clinic's patient records"
    >
      <div className="space-y-6">
        <div className="h-9 w-64 rounded-lg bg-muted animate-pulse" />
        <div className="h-64 rounded-lg bg-muted animate-pulse" />
      </div>
    </PageShell>
  );
}
