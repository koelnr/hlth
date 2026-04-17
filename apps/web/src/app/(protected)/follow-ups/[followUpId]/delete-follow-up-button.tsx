"use client";

import * as React from "react";
import { AlertDialog } from "radix-ui";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteFollowUpAction } from "./actions";

interface DeleteFollowUpButtonProps {
  followUpId: string;
  patientName: string;
}

export function DeleteFollowUpButton({ followUpId, patientName }: DeleteFollowUpButtonProps) {
  const [open, setOpen] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();

  function handleConfirm() {
    startTransition(async () => {
      await deleteFollowUpAction(followUpId);
      // redirect() is called inside the action on success; this line is
      // only reached on error (redirect throws, caught by Next.js boundary).
    });
  }

  return (
    <AlertDialog.Root
      open={open}
      onOpenChange={(next) => {
        // Prevent closing the dialog while deletion is in progress.
        if (!isPending) setOpen(next);
      }}
    >
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
            Delete follow-up?
          </AlertDialog.Title>
          <AlertDialog.Description className="text-sm text-muted-foreground mb-6">
            This will permanently delete the follow-up for{" "}
            <span className="font-medium text-foreground">{patientName}</span>.
            To keep a record, consider cancelling it instead. This action cannot
            be undone.
          </AlertDialog.Description>
          <div className="flex items-center justify-end gap-3">
            <Button
              variant="outline"
              size="sm"
              disabled={isPending}
              onClick={() => setOpen(false)}
            >
              Keep follow-up
            </Button>
            <Button
              variant="destructive"
              size="sm"
              disabled={isPending}
              onClick={handleConfirm}
            >
              {isPending ? "Deleting…" : "Delete follow-up"}
            </Button>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  );
}
