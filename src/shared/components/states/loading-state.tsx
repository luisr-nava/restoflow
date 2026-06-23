type LoadingStateProps = {
  label?: string;
  className?: string;
};

export function LoadingState({
  label = "Cargando...",
  className = "",
}: LoadingStateProps) {
  return (
    <div
      className={`rounded-2xl border border-border bg-background p-6 text-sm text-muted-foreground ${className}`.trim()}>
      {label}
    </div>
  );
}
