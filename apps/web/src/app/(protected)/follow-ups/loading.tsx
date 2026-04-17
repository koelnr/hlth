import { PageShell } from "@/components/app/page-shell";

export default function Loading() {
  return (
    <PageShell
      title="Follow-ups"
      description="Track and manage patient follow-up tasks"
    >
      <div className="space-y-6">
        <div className="rounded-lg border border-border overflow-hidden animate-pulse">
          <div className="h-9 bg-muted/40 border-b border-border" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 border-b border-border last:border-0">
              <div className="flex-1 space-y-1.5">
                <div className="h-3.5 w-32 rounded bg-muted" />
                <div className="h-3 w-48 rounded bg-muted/60" />
              </div>
              <div className="h-3 w-16 rounded bg-muted" />
            </div>
          ))}
        </div>
        <div className="rounded-lg border border-border overflow-hidden animate-pulse">
          <div className="h-9 bg-muted/40 border-b border-border" />
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3 border-b border-border last:border-0">
              <div className="flex-1 space-y-1.5">
                <div className="h-3.5 w-28 rounded bg-muted" />
                <div className="h-3 w-40 rounded bg-muted/60" />
              </div>
              <div className="h-3 w-16 rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
