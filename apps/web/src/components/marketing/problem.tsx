import {
  CalendarX2,
  FileQuestion,
  Users,
  Timer,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { problem } from "@/content/landing";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  CalendarX2,
  FileQuestion,
  Users,
  Timer,
};

export function Problem() {
  return (
    <section id="problem" className="bg-muted/30 py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="outline" className="mb-4">
            {problem.label}
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {problem.headline}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {problem.body}
          </p>
        </div>

        {/* Pain point cards */}
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {problem.points.map((point) => {
            const Icon = iconMap[point.icon];
            return (
              <Card key={point.title} className="bg-background">
                <CardHeader>
                  <div className="mb-1 flex size-9 items-center justify-center rounded-lg bg-destructive/10">
                    {Icon && <Icon className="size-4 text-destructive" />}
                  </div>
                  <CardTitle className="text-base">{point.title}</CardTitle>
                  <CardDescription>{point.body}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
