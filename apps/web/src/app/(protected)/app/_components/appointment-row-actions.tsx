"use client";

import * as React from "react";
import { Badge } from "@/components/ui/badge";
import { updateAppointmentStatusAction } from "@/app/(protected)/appointments/[appointmentId]/actions";
import type { AppointmentStatus } from "@/lib/data/models";

function statusLabel(status: AppointmentStatus): string {
  const labels: Record<AppointmentStatus, string> = {
    scheduled: "Scheduled",
    completed: "Completed",
    cancelled: "Cancelled",
    no_show: "No show",
  };
  return labels[status];
}

function statusVariant(
  status: AppointmentStatus,
): "default" | "secondary" | "outline" | "destructive" {
  if (status === "scheduled") return "default";
  if (status === "completed") return "secondary";
  if (status === "cancelled") return "destructive";
  return "outline"; // no_show
}

interface AppointmentRowActionsProps {
  appointmentId: string;
  initialStatus: AppointmentStatus;
}

export function AppointmentRowActions({
  appointmentId,
  initialStatus,
}: AppointmentRowActionsProps) {
  const [optimisticStatus, setOptimisticStatus] = React.useState(initialStatus);
  const [isPending, startTransition] = React.useTransition();

  function handleStatus(status: AppointmentStatus) {
    if (status === optimisticStatus || isPending) return;
    const previous = optimisticStatus;
    setOptimisticStatus(status);
    startTransition(async () => {
      try {
        await updateAppointmentStatusAction(appointmentId, status);
      } catch {
        setOptimisticStatus(previous);
      }
    });
  }

  return (
    <div className="flex items-center gap-2">
      <Badge variant={statusVariant(optimisticStatus)} className="text-xs">
        {statusLabel(optimisticStatus)}
      </Badge>
      {optimisticStatus === "scheduled" && (
        <>
          <button
            onClick={() => handleStatus("completed")}
            disabled={isPending}
            className="text-xs px-2 py-0.5 rounded border border-border text-muted-foreground hover:border-emerald-500/60 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors disabled:opacity-40"
          >
            Done
          </button>
          <button
            onClick={() => handleStatus("no_show")}
            disabled={isPending}
            className="text-xs px-2 py-0.5 rounded border border-border text-muted-foreground hover:border-destructive/50 hover:text-destructive transition-colors disabled:opacity-40"
          >
            No-show
          </button>
        </>
      )}
    </div>
  );
}
