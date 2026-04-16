import { PageShell } from "@/components/app/page-shell";

export default function Loading() {
  return (
    <PageShell title="Dashboard" description="An overview of your clinic's activity">
      <div className="space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-28 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="h-72 rounded-xl bg-muted animate-pulse" />
          <div className="h-72 rounded-xl bg-muted animate-pulse" />
        </div>
      </div>
    </PageShell>
  );
}
