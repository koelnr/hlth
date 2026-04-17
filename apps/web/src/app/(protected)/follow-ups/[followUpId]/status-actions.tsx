"use client";

import * as React from "react";
import type { FollowUpStatus } from "@/lib/data/models";
import { updateFollowUpStatusAction } from "./actions";

const STATUSES: { value: FollowUpStatus; label: string }[] = [
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
  { value: "cancelled", label: "Cancelled" },
];

const ACTIVE_STYLES: Record<FollowUpStatus, string> = {
  pending: "bg-foreground text-background border-foreground",
  completed: "bg-green-600 text-white border-green-600",
  cancelled: "bg-muted text-muted-foreground border-border",
};

interface StatusActionsProps {
  followUpId: string;
  currentStatus: FollowUpStatus;
}

export function StatusActions({ followUpId, currentStatus }: StatusActionsProps) {
  const [optimisticStatus, setOptimisticStatus] = React.useState(currentStatus);
  const [isPending, startTransition] = React.useTransition();
  const [error, setError] = React.useState<string | null>(null);

  function handleStatusChange(status: FollowUpStatus) {
    if (status === optimisticStatus) return;
    const previous = optimisticStatus;
    setOptimisticStatus(status);
    setError(null);
    startTransition(async () => {
      try {
        await updateFollowUpStatusAction(followUpId, status);
      } catch {
        setOptimisticStatus(previous);
        setError("Failed to update status. Please try again.");
      }
    });
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {STATUSES.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => handleStatusChange(value)}
            disabled={isPending}
            className={[
              "px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors",
              optimisticStatus === value
                ? ACTIVE_STYLES[value]
                : "bg-transparent text-muted-foreground border-border hover:text-foreground hover:border-foreground/50 disabled:opacity-50",
            ].join(" ")}
          >
            {label}
          </button>
        ))}
      </div>
      {error !== null && (
        <p className="text-xs text-destructive">{error}</p>
      )}
    </div>
  );
}
