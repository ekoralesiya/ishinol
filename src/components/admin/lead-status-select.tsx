"use client";

import { useState, useTransition } from "react";
import { Loader2 } from "lucide-react";
import { updateLeadStatus } from "@/app/admin/actions";

const STATUSES = ["new", "contacted", "qualified", "closed"];

export function LeadStatusSelect({ id, status }: { id: string; status: string }) {
  const [value, setValue] = useState(status);
  const [pending, startTransition] = useTransition();

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value;
    const prev = value;
    setValue(next);
    startTransition(async () => {
      const res = await updateLeadStatus(id, next);
      if (!res.ok) setValue(prev);
    });
  }

  return (
    <span className="inline-flex items-center gap-1.5">
      <select
        value={value}
        onChange={onChange}
        disabled={pending}
        className="h-8 rounded-md border border-input bg-background px-2 text-xs capitalize focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
      >
        {STATUSES.map((s) => (
          <option key={s} value={s} className="capitalize">{s}</option>
        ))}
      </select>
      {pending && <Loader2 className="size-3.5 animate-spin text-muted-foreground" />}
    </span>
  );
}
