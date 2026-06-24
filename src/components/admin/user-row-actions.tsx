"use client";

import { useState, useTransition } from "react";
import { Loader2, Power } from "lucide-react";
import { DeleteButton } from "@/components/admin/delete-button";
import { updateUserRole, toggleUserActive, deleteUser } from "@/app/admin/actions";
import type { Role } from "@prisma/client";

const ROLES: Role[] = ["SUPER_ADMIN", "ADMIN", "EDITOR"];

export function UserRowActions({
  id,
  role,
  isActive,
  isSelf,
}: {
  id: string;
  role: Role;
  isActive: boolean;
  isSelf: boolean;
}) {
  const [currentRole, setCurrentRole] = useState<Role>(role);
  const [active, setActive] = useState(isActive);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onRoleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const next = e.target.value as Role;
    const prev = currentRole;
    setCurrentRole(next);
    setError(null);
    startTransition(async () => {
      const res = await updateUserRole(id, next);
      if (!res.ok) {
        setCurrentRole(prev);
        setError(res.error ?? "Failed");
      }
    });
  }

  function onToggleActive() {
    const next = !active;
    setActive(next);
    setError(null);
    startTransition(async () => {
      const res = await toggleUserActive(id, next);
      if (!res.ok) {
        setActive(!next);
        setError(res.error ?? "Failed");
      }
    });
  }

  if (isSelf) {
    return <span className="text-xs text-muted-foreground">You</span>;
  }

  return (
    <div className="flex flex-wrap items-center justify-end gap-2">
      <select
        value={currentRole}
        onChange={onRoleChange}
        disabled={pending}
        className="h-8 rounded-md border border-input bg-background px-2 text-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
      >
        {ROLES.map((r) => (
          <option key={r} value={r}>{r}</option>
        ))}
      </select>
      <button
        type="button"
        onClick={onToggleActive}
        disabled={pending}
        className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium text-ink-muted hover:bg-muted disabled:opacity-50"
        title={active ? "Deactivate" : "Activate"}
      >
        {pending ? <Loader2 className="size-3.5 animate-spin" /> : <Power className="size-3.5" />}
        {active ? "Deactivate" : "Activate"}
      </button>
      <DeleteButton id={id} action={deleteUser} />
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  );
}
