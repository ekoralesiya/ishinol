"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import type { ActionResult } from "@/app/admin/actions";

/**
 * Generic client wrapper around a FormData server action.
 * Renders children (the inputs), runs the action on submit, and shows
 * inline success/error feedback. Optionally resets the form on success.
 */
export function ActionForm({
  action,
  children,
  resetOnSuccess = false,
  successMessage = "Saved.",
  className,
}: {
  action: (formData: FormData) => Promise<ActionResult>;
  children: React.ReactNode;
  resetOnSuccess?: boolean;
  successMessage?: string;
  className?: string;
}) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setOk(false);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await action(fd);
      if (!res.ok) {
        setError(res.error ?? "Failed");
        return;
      }
      setOk(true);
      if (resetOnSuccess) formRef.current?.reset();
      router.refresh();
    });
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} className={className}>
      <fieldset disabled={pending} className="space-y-4">
        {children}
      </fieldset>
      {error && (
        <p className="mt-3 rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>
      )}
      {ok && (
        <p className="mt-3 inline-flex items-center gap-1.5 text-sm text-emerald-600">
          <CheckCircle2 className="size-4" /> {successMessage}
        </p>
      )}
    </form>
  );
}
