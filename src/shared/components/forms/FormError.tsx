import type { ReactNode } from "react";

export function FormError({ children }: { children: ReactNode }) {
  return (
    <p className="border-danger bg-danger-soft text-danger rounded-md border-l-4 px-3 py-2 text-sm font-medium">
      {children}
    </p>
  );
}

