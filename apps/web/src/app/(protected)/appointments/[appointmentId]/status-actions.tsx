"use client";

import * as React from "react";
import type { AppointmentStatus } from "@/lib/data/models";
import { updateAppointmentStatusAction } from "./actions";

const STATUSES: { value: AppointmentStatus; label: string }[] = [
  { value: "scheduled", label: "Scheduled" },
  { value: "completed", label: "Completed" },
  { value: "no_show", label: "No show" },
  { value: "cancelled", label: "Cancelled" },
];

interface StatusActionsProps {
  appointmentId: string;
  currentStatus: AppointmentStatus;
}

export function StatusActions({
  appointmentId,
  currentStatus,
}: StatusActionsProps) {
  const [optimisticStatus, setOptimisticStatus] =
    React.useState(currentStatus);
  const [isPending, startTransition] = React.useTransition();

  function handleStatusChange(status: AppointmentStatus) {
    if (status === optimisticStatus) return;
    setOptimisticStatus(status);
    startTransition(async () => {
      await updateAppointmentStatusAction(appointmentId, status);
    });
  }

  return (
    <div className="flex flex-wrap gap-2">
      {STATUSES.map(({ value, label }) => (
        <button
          key={value}
          onClick={() => handleStatusChange(value)}
          disabled={isPending}
          className={[
            "px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors",
            optimisticStatus === value
              ? "bg-foreground text-background border-foreground"
              : "bg-transparent text-muted-foreground border-border hover:text-foreground hover:border-foreground/50 disabled:opacity-50",
          ].join(" ")}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
