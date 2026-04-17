import { PageShell } from "@/components/app/page-shell";

export default function Loading() {
  return (
    <PageShell title="Patient" description="Patient record">
      <div className="max-w-2xl space-y-4">
        <div className="h-32 rounded-xl bg-muted animate-pulse" />
        <div className="h-28 rounded-xl bg-muted animate-pulse" />
        <div className="h-24 rounded-xl bg-muted animate-pulse" />
        <div className="h-20 rounded-xl bg-muted animate-pulse" />
      </div>
    </PageShell>
  );
}
