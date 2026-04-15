import {
  Stethoscope,
  Zap,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { trust } from "@/content/landing";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Stethoscope,
  Zap,
  ShieldCheck,
  TrendingUp,
};

export function Trust() {
  return (
    <section id="trust" className="bg-background py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-4">
            {trust.label}
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {trust.headline}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {trust.body}
          </p>
        </div>

        {/* Trust points */}
        <div className="mt-14 grid gap-4 sm:grid-cols-2">
          {trust.points.map((point) => {
            const Icon = iconMap[point.icon];
            return (
              <Card key={point.title}>
                <div className="flex items-start gap-4 px-4">
                  <div className="mt-0.5 flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    {Icon && <Icon className="size-5 text-primary" />}
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <CardTitle className="text-base">{point.title}</CardTitle>
                    <CardDescription>{point.body}</CardDescription>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
