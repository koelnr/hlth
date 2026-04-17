"use client";

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

interface SubmitButtonProps {
  label: string;
  pendingLabel?: string;
}

/**
 * A submit button that automatically disables and shows a pending label
 * while the parent form's server action is in flight.
 * Must be rendered inside a <form> element to pick up useFormStatus.
 */
export function SubmitButton({ label, pendingLabel = "Saving…" }: SubmitButtonProps) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" disabled={pending}>
      {pending ? pendingLabel : label}
    </Button>
  );
}
