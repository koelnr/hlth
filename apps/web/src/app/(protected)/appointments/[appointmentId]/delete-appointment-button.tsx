"use client";

import * as React from "react";
import { AlertDialog } from "radix-ui";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteAppointmentAction } from "./actions";

interface DeleteAppointmentButtonProps {
  appointmentId: string;
  patientName: string;
}

export function DeleteAppointmentButton({
  appointmentId,
  patientName,
}: DeleteAppointmentButtonProps) {
  const [isPending, startTransition] = React.useTransition();

  function handleConfirm() {
    startTransition(async () => {
      await deleteAppointmentAction(appointmentId);
    });
  }

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="h-4 w-4 mr-1.5" />
          Delete
        </Button>
      </AlertDialog.Trigger>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <AlertDialog.Content className="fixed z-50 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-background border border-border rounded-xl p-6 shadow-xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          <AlertDialog.Title className="text-base font-semibold text-foreground mb-1.5">
            Delete appointment?
          </AlertDialog.Title>
          <AlertDialog.Description className="text-sm text-muted-foreground mb-6">
            This will permanently delete the appointment for{" "}
            <span className="font-medium text-foreground">{patientName}</span>.
            To keep a record, consider cancelling it instead. This action cannot
            be undone.
          </AlertDialog.Description>
          <div className="flex items-center justify-end gap-3">
            <AlertDialog.Cancel asChild>
              <Button variant="outline" size="sm" disabled={isPending}>
                Keep appointment
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action asChild>
              <Button
                variant="destructive"
                size="sm"
                disabled={isPending}
                onClick={handleConfirm}
              >
                {isPending ? "Deleting…" : "Delete appointment"}
              </Button>
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
