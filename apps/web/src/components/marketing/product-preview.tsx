import { CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { productPreview } from "@/content/landing";

function WorkspaceVisual() {
  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-lg">
      {/* Top bar */}
      <div className="border-b border-border bg-muted/20 px-5 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-sm font-semibold text-foreground">Today's overview</div>
          <Badge variant="secondary" className="text-[10px]">Live</Badge>
        </div>
        <div className="text-xs text-muted-foreground">Wed, Apr 15</div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col gap-4">
        {/* Role views */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { role: "Doctor", name: "Dr. Arora", count: "8 patients", color: "bg-primary/10 text-primary" },
            { role: "Front Desk", name: "Meera", count: "12 appts", color: "bg-emerald-50 text-emerald-600" },
            { role: "Manager", name: "Vikram", count: "Full view", color: "bg-violet-50 text-violet-600" },
          ].map((person) => (
            <div
              key={person.role}
              className="flex flex-col gap-2 rounded-xl border border-border bg-background p-3"
            >
              <div className={`w-fit rounded-full px-2 py-0.5 text-[10px] font-medium ${person.color}`}>
                {person.role}
              </div>
              <div className="text-sm font-medium text-foreground leading-tight">{person.name}</div>
              <div className="text-xs text-muted-foreground">{person.count}</div>
            </div>
          ))}
        </div>

        {/* Workflow steps */}
        <div className="rounded-xl border border-border bg-background p-4">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
            Patient visit flow
          </div>
          <div className="flex items-center gap-2">
            {["Check-in", "Consultation", "Notes", "Follow-up"].map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <div className="flex flex-col items-center">
                  <div className={`size-7 rounded-full flex items-center justify-center text-xs font-medium ${
                    i < 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}>
                    {i < 2 ? <CheckCircle2 className="size-3.5" /> : i + 1}
                  </div>
                  <div className="mt-1 text-[10px] text-muted-foreground whitespace-nowrap">{step}</div>
                </div>
                {i < 3 && (
                  <div className={`h-px w-6 mb-4 ${i < 1 ? "bg-primary" : "bg-border"}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border bg-background p-3">
            <div className="text-lg font-bold text-foreground">94%</div>
            <div className="text-xs text-muted-foreground">Appointment completion</div>
          </div>
          <div className="rounded-xl border border-border bg-background p-3">
            <div className="text-lg font-bold text-foreground">3 min</div>
            <div className="text-xs text-muted-foreground">Avg. check-in time</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductPreview() {
  return (
    <section id="how-it-works" className="bg-muted/20 py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Visual */}
          <div className="order-2 lg:order-1">
            <WorkspaceVisual />
          </div>

          {/* Text */}
          <div className="order-1 flex flex-col gap-6 lg:order-2">
            <Badge variant="outline">{productPreview.label}</Badge>
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              {productPreview.headline}
            </h2>
            <p className="text-base leading-relaxed text-muted-foreground">
              {productPreview.body}
            </p>

            <div className="flex flex-col gap-5 mt-2">
              {productPreview.points.map((point, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/10 mt-0.5">
                    <span className="text-xs font-semibold text-primary">{i + 1}</span>
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-foreground mb-1">
                      {point.title}
                    </div>
                    <div className="text-sm leading-relaxed text-muted-foreground">
                      {point.body}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
