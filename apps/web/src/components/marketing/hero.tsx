import Link from "next/link";
import {
  CalendarDays,
  UserRound,
  UsersRound,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { hero } from "@/content/landing";
import { cn } from "@/lib/utils";

const mockAppointments = [
  {
    time: "9:00 AM",
    name: "Priya Sharma",
    type: "General consultation",
    status: "Confirmed",
    accent: "bg-primary",
    statusClass: "bg-primary/10 text-primary",
  },
  {
    time: "10:30 AM",
    name: "Rajiv Mehta",
    type: "Follow-up",
    status: "Confirmed",
    accent: "bg-primary",
    statusClass: "bg-primary/10 text-primary",
  },
  {
    time: "11:00 AM",
    name: "Sarah Chen",
    type: "Check-up",
    status: "Pending",
    accent: "bg-amber-400",
    statusClass: "bg-amber-50 text-amber-600",
  },
  {
    time: "2:00 PM",
    name: "David Okonkwo",
    type: "Consultation",
    status: "Upcoming",
    accent: "bg-muted-foreground",
    statusClass: "bg-muted text-muted-foreground",
  },
];

function DashboardMock() {
  return (
    <div className="relative rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
      {/* Window chrome */}
      <div className="flex items-center gap-1.5 border-b border-border bg-muted/30 px-4 py-3">
        <div className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
        <div className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
        <div className="h-2.5 w-2.5 rounded-full bg-emerald-400/70" />
        <div className="ml-4 h-5 flex-1 max-w-48 rounded-md bg-muted" />
      </div>

      {/* App content */}
      <div className="flex h-72 sm:h-80">
        {/* Sidebar */}
        <div className="hidden sm:flex w-36 flex-col border-r border-border bg-muted/10 p-3 gap-0.5 shrink-0">
          <div className="mb-2 px-2 text-[9px] font-semibold uppercase tracking-widest text-muted-foreground">
            Clinic
          </div>
          {[
            { label: "Today", active: true },
            { label: "Appointments", active: false },
            { label: "Patients", active: false },
            { label: "Staff", active: false },
            { label: "Reports", active: false },
          ].map((item) => (
            <div
              key={item.label}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs",
                item.active
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground",
              )}
            >
              {item.label}
            </div>
          ))}

          <div className="mt-auto flex items-center gap-2 border-t border-border pt-3">
            <div className="size-6 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
              <span className="text-[9px] font-semibold text-primary">DR</span>
            </div>
            <div className="min-w-0">
              <div className="text-[10px] font-medium text-foreground truncate">
                Dr. Arora
              </div>
              <div className="text-[9px] text-muted-foreground">General</div>
            </div>
          </div>
        </div>

        {/* Main */}
        <div className="flex flex-1 flex-col overflow-hidden p-3 gap-3">
          {/* Header row */}
          <div className="flex items-center justify-between">
            <div>
              <div className="text-xs font-semibold text-foreground">
                Wednesday, Apr 15
              </div>
              <div className="text-[10px] text-muted-foreground">
                Good morning
              </div>
            </div>
            <div className="flex items-center gap-1">
              <CalendarDays className="size-3 text-muted-foreground" />
              <UserRound className="size-3 text-muted-foreground" />
              <UsersRound className="size-3 text-muted-foreground" />
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: "12", label: "Appointments" },
              { value: "4", label: "Remaining" },
              { value: "18", label: "Patients" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-lg border border-border bg-background p-2"
              >
                <div className="text-sm font-bold text-foreground">
                  {stat.value}
                </div>
                <div className="text-[9px] text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Appointment list */}
          <div className="flex flex-col gap-1.5 overflow-hidden">
            <div className="text-[9px] font-semibold uppercase tracking-widest text-muted-foreground">
              Upcoming
            </div>
            {mockAppointments.map((appt) => (
              <div
                key={appt.time + appt.name}
                className="flex items-center gap-2.5 rounded-lg border border-border bg-background px-2.5 py-2"
              >
                <div
                  className={cn("h-7 w-0.5 rounded-full shrink-0", appt.accent)}
                />
                <div className="min-w-0 flex-1">
                  <div className="text-[11px] font-medium text-foreground truncate">
                    {appt.name}
                  </div>
                  <div className="flex items-center gap-1 text-[9px] text-muted-foreground">
                    <Clock className="size-2.5" />
                    {appt.time} · {appt.type}
                  </div>
                </div>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2 py-0.5 text-[9px] font-medium",
                    appt.statusClass,
                  )}
                >
                  {appt.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex items-center gap-2 border-t border-border bg-muted/10 px-4 py-2">
        <CheckCircle2 className="size-3 text-emerald-500" />
        <span className="text-[10px] text-muted-foreground">
          All systems running
        </span>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/50 bg-background">
      <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Text */}
          <div className="flex flex-col items-start gap-6">
            <Badge variant="secondary" className="text-xs">
              {hero.badge}
            </Badge>

            <h1 className="text-4xl font-bold leading-[1.1] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {hero.headline.split("\n").map((line, i) => (
                <span key={i}>
                  {i > 0 && <br />}
                  {line}
                </span>
              ))}
            </h1>

            <p className="max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg">
              {hero.subheadline}
            </p>

            <div className="flex flex-wrap gap-3">
              {hero.ctas.map((cta) => (
                <Button
                  key={cta.href}
                  asChild
                  variant={cta.primary ? "default" : "outline"}
                  size="lg"
                  className="h-11 px-6 text-sm"
                >
                  <Link href={cta.href}>{cta.label}</Link>
                </Button>
              ))}
            </div>
          </div>

          {/* Mock dashboard */}
          <div className="relative">
            <div
              className="absolute -inset-4 rounded-3xl bg-primary/5 blur-2xl"
              aria-hidden
            />
            <DashboardMock />
          </div>
        </div>
      </div>
    </section>
  );
}
