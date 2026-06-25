import type { ReactNode } from "react";

import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/src/shared/components/states";

type ReportWidgetCardProps = {
  title: string;
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
  isEmpty: boolean;
  loadingLabel: string;
  emptyTitle: string;
  emptyDescription: string;
  children: ReactNode;
};

export function ReportWidgetCard({
  title,
  isLoading,
  isError,
  errorMessage,
  isEmpty,
  loadingLabel,
  emptyTitle,
  emptyDescription,
  children,
}: ReportWidgetCardProps) {
  return (
    <div className="rounded-2xl border border-border bg-background">
      <div className="border-b border-border px-4 py-3">
        <h2 className="text-sm font-medium">{title}</h2>
      </div>

      {isLoading ? (
        <LoadingState
          label={loadingLabel}
          className="rounded-none border-0 bg-transparent"
        />
      ) : isError ? (
        <ErrorState
          title={`No se pudo cargar ${title.toLowerCase()}`}
          description={errorMessage}
          className="rounded-none border-0 bg-transparent"
        />
      ) : isEmpty ? (
        <EmptyState
          title={emptyTitle}
          description={emptyDescription}
          className="rounded-none border-0 bg-transparent"
        />
      ) : (
        children
      )}
    </div>
  );
}
