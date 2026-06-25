type ErrorStateProps = {
  title: string;
  description?: string;
  className?: string;
};

export function ErrorState({
  title,
  description,
  className = "",
}: ErrorStateProps) {
  return (
    <div
      className={`rounded-2xl border border-red-200 bg-background p-6 text-center ${className}`.trim()}>
      <h2 className="text-base font-semibold text-foreground">{title}</h2>

      {description && (
        <p className="mt-2 text-sm text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
