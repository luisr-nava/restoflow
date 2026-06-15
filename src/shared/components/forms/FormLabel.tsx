import type { LabelHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

type Props = LabelHTMLAttributes<HTMLLabelElement> & {
  children: ReactNode;
};

export function FormLabel({ children, className, ...props }: Props) {
  return (
    <label
      {...props}
      className={clsx(
        "block font-mono text-[11px] uppercase tracking-[0.08em] text-text-3",
        className,
      )}>
      {children}
    </label>
  );
}

