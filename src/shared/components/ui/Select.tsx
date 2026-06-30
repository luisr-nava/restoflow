"use client";

import {
  forwardRef,
  type ReactNode,
  type SelectHTMLAttributes,
} from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  children: ReactNode;
};

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ children, className, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={twMerge(
          clsx(
            "w-full rounded-lg border border-border bg-surface px-3 py-2.5 text-text outline-none transition-all",
            "focus:border-accent focus:ring-4 focus:ring-accent/20",
          ),
          className,
        )}
        {...props}>
        {children}
      </select>
    );
  },
);

Select.displayName = "Select";
