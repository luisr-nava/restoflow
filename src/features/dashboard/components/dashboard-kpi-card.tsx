import type { ReactNode } from "react";

type DashboardKpiCardProps = {
  title: string;
  value: string | number;
  description?: string;
  icon?: ReactNode;
};

export function DashboardKpiCard({
  title,
  value,
  description,
  icon,
}: DashboardKpiCardProps) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
            {title}
          </p>

          <p className="mt-3 text-2xl font-semibold text-foreground">{value}</p>

          {description && (
            <p className="mt-2 text-xs text-muted-foreground">{description}</p>
          )}
        </div>

        {icon && (
          <div className="flex size-10 items-center justify-center rounded-full bg-muted text-foreground">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
