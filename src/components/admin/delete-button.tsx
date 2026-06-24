"use client";

import { useState, useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ActionResult } from "@/app/admin/actions";

/**
 * Confirm-then-delete button. Accepts a bound server action that takes the id.
 * Shows a lightweight inline confirm before firing.
 */
export function DeleteButton({
  id,
  action,
  label = "Delete",
  className,
}: {
  id: string;
  action: (id: string) => Promise<ActionResult>;
  label?: string;
  className?: string;
}) {
  const [confirming, setConfirming] = useState(false);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onClick() {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    startTransition(async () => {
      const res = await action(id);
      if (!res.ok) setError(res.error ?? "Failed");
      setConfirming(false);
    });
  }

  return (
    <span className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={onClick}
        disabled={pending}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-colors disabled:opacity-50",
          confirming
            ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
            : "text-destructive hover:bg-destructive/10",
          className,
        )}
        title={confirming ? "Click again to confirm" : label}
      >
        {pending ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
        {confirming ? "Confirm?" : label}
      </button>
      {error && <span className="text-xs text-destructive">{error}</span>}
    </span>
  );
}
