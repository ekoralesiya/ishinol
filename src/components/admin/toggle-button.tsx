"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { toggleFlag } from "@/app/admin/actions";

type Model = "product" | "portfolioProject" | "article" | "video" | "download" | "testimonial";
type Field = "isActive" | "isFeatured" | "isPublished";

/**
 * Optimistic flag toggle (e.g. featured/active) that calls the toggleFlag
 * server action. `revalidate` is the path to revalidate after the mutation.
 */
export function ToggleButton({
  model,
  id,
  field,
  value,
  revalidate,
  onLabel = "On",
  offLabel = "Off",
}: {
  model: Model;
  id: string;
  field: Field;
  value: boolean;
  revalidate: string;
  onLabel?: string;
  offLabel?: string;
}) {
  const [on, setOn] = useState(value);
  const [pending, startTransition] = useTransition();

  function toggle() {
    const next = !on;
    setOn(next);
    startTransition(async () => {
      const res = await toggleFlag(model, id, field, next, revalidate);
      if (!res.ok) setOn(!next); // revert on failure
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={pending}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium transition-colors disabled:opacity-50",
        on ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground",
      )}
    >
      {pending && <Loader2 className="size-3 animate-spin" />}
      {on ? onLabel : offLabel}
    </button>
  );
}
