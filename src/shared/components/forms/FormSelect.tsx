"use client";

import clsx from "clsx";
import type { SelectHTMLAttributes } from "react";
import { useFormContext } from "react-hook-form";

import { FormError } from "./FormError";
import { FormLabel } from "./FormLabel";

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  name: string;
  label?: string;
};

export function FormSelect({
  name,
  label,
  children,
  className,
  ...props
}: Props) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message;

  return (
    <div className="space-y-1.5">
      {label && <FormLabel htmlFor={name}>{label}</FormLabel>}

      <select
        id={name}
        {...register(name)}
        {...props}
        className={clsx(
          "bg-surface border-border text-text",
          "focus:border-accent focus:ring-accent/20",
          "w-full rounded-lg border px-3 py-2.5",
          "outline-none transition-all focus:ring-4",
          typeof error === "string" &&
            "border-danger focus:border-danger focus:ring-danger/20",
          className,
        )}>
        {children}
      </select>

      {typeof error === "string" && <FormError>{error}</FormError>}
    </div>
  );
}

