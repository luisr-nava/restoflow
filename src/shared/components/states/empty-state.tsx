import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({
  title,
  description,
  action,
  className = "",
}: EmptyStateProps) {
  return (
    <div
      className={`rounded-2xl border border-border bg-background p-6 text-center ${className}`.trim()}>
      <h2 className="text-base font-semibold text-foreground">{title}</h2>

      {description && (
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      )}

      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}
