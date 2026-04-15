import {
  CalendarDays,
  UserRound,
  UsersRound,
  ClipboardList,
  BellRing,
  BarChart3,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { features } from "@/content/landing";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  CalendarDays,
  UserRound,
  UsersRound,
  ClipboardList,
  BellRing,
  BarChart3,
};

export function Features() {
  return (
    <section id="features" className="bg-background py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <Badge variant="secondary" className="mb-4">
            {features.label}
          </Badge>
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            {features.headline}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
            {features.body}
          </p>
        </div>

        {/* Feature cards */}
        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.items.map((item) => {
            const Icon = iconMap[item.icon];
            return (
              <Card key={item.title}>
                <CardHeader>
                  <div className="mb-1 flex size-9 items-center justify-center rounded-lg bg-primary/10">
                    {Icon && <Icon className="size-4 text-primary" />}
                  </div>
                  <CardTitle className="text-base">{item.title}</CardTitle>
                  <CardDescription>{item.body}</CardDescription>
                </CardHeader>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
