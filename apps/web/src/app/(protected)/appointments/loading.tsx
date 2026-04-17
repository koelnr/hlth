import { PageShell } from "@/components/app/page-shell";

export default function Loading() {
  return (
    <PageShell
      title="Appointments"
      description="View and manage scheduled appointments"
    >
      <div className="rounded-lg border border-border overflow-hidden animate-pulse">
        <div className="h-10 bg-muted/50 border-b border-border" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-14 bg-muted/20 border-b border-border last:border-0" />
        ))}
      </div>
    </PageShell>
  );
}
