"use client";

import * as React from "react";
import Link from "next/link";
import { EmptyState } from "@/components/app/empty-state";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Plus } from "lucide-react";
import type { AppointmentStatus } from "@/lib/data/models";

export interface AppointmentListItem {
  id: string;
  patientId: string;
  patientName: string;
  dateDisplay: string;
  timeDisplay: string;
  durationMinutes: number;
  reason: string | null;
  status: AppointmentStatus;
}

const STATUS_LABELS: Record<AppointmentStatus, string> = {
  scheduled: "Scheduled",
  completed: "Completed",
  cancelled: "Cancelled",
  no_show: "No show",
};

function statusVariant(status: AppointmentStatus): "default" | "secondary" | "outline" | "destructive" {
  if (status === "scheduled") return "default";
  if (status === "completed") return "secondary";
  if (status === "cancelled") return "destructive";
  return "outline";
}

const FILTER_OPTIONS: { value: AppointmentStatus | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "scheduled", label: "Scheduled" },
  { value: "completed", label: "Completed" },
  { value: "no_show", label: "No show" },
  { value: "cancelled", label: "Cancelled" },
];

function AppointmentRow({ appt }: { appt: AppointmentListItem }) {
  return (
    <tr className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
      <td className="px-4 py-3">
        <Link
          href={`/appointments/${appt.id}`}
          className="text-sm font-medium text-foreground hover:text-primary hover:underline underline-offset-2"
        >
          {appt.patientName}
        </Link>
      </td>
      <td className="px-4 py-3">
        <p className="text-sm text-foreground">{appt.dateDisplay}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{appt.timeDisplay}</p>
      </td>
      <td className="px-4 py-3 hidden md:table-cell">
        <p className="text-sm text-muted-foreground">{appt.durationMinutes} min</p>
      </td>
      <td className="px-4 py-3 hidden sm:table-cell">
        <p className="text-sm text-muted-foreground truncate max-w-[180px]">
          {appt.reason ?? "—"}
        </p>
      </td>
      <td className="px-4 py-3">
        <Badge variant={statusVariant(appt.status)} className="text-xs">
          {STATUS_LABELS[appt.status]}
        </Badge>
      </td>
      <td className="px-4 py-3 text-right">
        <Link
          href={`/appointments/${appt.id}`}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          aria-label={`View appointment for ${appt.patientName}`}
        >
          →
        </Link>
      </td>
    </tr>
  );
}

interface AppointmentsListProps {
  appointments: AppointmentListItem[];
}

export function AppointmentsList({ appointments }: AppointmentsListProps) {
  const [statusFilter, setStatusFilter] = React.useState<AppointmentStatus | "all">("all");

  const filtered =
    statusFilter === "all"
      ? appointments
      : appointments.filter((a) => a.status === statusFilter);

  return (
    <>
      {/* Status filter */}
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        {FILTER_OPTIONS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setStatusFilter(value)}
            className={[
              "px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors",
              statusFilter === value
                ? "bg-foreground text-background border-foreground"
                : "bg-transparent text-muted-foreground border-border hover:text-foreground hover:border-foreground/50",
            ].join(" ")}
          >
            {label}
          </button>
        ))}
      </div>

      {appointments.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No appointments yet"
          description="Schedule your first appointment to get started."
          action={
            <Button asChild size="sm">
              <Link href="/appointments/new">
                <Plus className="h-4 w-4 mr-1.5" />
                Schedule Appointment
              </Link>
            </Button>
          }
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="No appointments"
          description={`No ${STATUS_LABELS[statusFilter as AppointmentStatus]?.toLowerCase()} appointments found.`}
        />
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Patient
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Date &amp; Time
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden md:table-cell">
                  Duration
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide hidden sm:table-cell">
                  Reason
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Status
                </th>
                <th className="px-4 py-3 w-8" />
              </tr>
            </thead>
            <tbody>
              {filtered.map((appt) => (
                <AppointmentRow key={appt.id} appt={appt} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
