import { PageShell } from "@/components/app/page-shell";

export default function Loading() {
  return (
    <PageShell
      title="Follow-ups"
      description="Track and manage pending patient follow-ups"
    >
      <div className="space-y-6">
        <div className="flex gap-3">
          <div className="h-9 w-24 rounded-lg bg-muted animate-pulse" />
          <div className="h-9 w-28 rounded-lg bg-muted animate-pulse" />
        </div>
        <div className="h-64 rounded-lg bg-muted animate-pulse" />
      </div>
    </PageShell>
  );
}
