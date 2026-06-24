import type { ReactNode } from "react";

/**
 * Standard admin page header: title, optional description, optional actions.
 * Server-component friendly (no client hooks).
 */
export function PageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">{title}</h2>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

/** Empty-state placeholder used across list pages (incl. DB-down fallback). */
export function EmptyState({ message }: { message: string }) {
  return (
    <div className="rounded-lg border border-dashed border-border bg-white/50 px-6 py-16 text-center">
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
