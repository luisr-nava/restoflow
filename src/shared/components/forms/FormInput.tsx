"use client";

import clsx from "clsx";
import type { InputHTMLAttributes } from "react";
import { useFormContext } from "react-hook-form";

import { FormError } from "./FormError";
import { FormLabel } from "./FormLabel";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label?: string;
};

export function FormInput({ name, label, className, ...props }: Props) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message;

  return (
    <div className="space-y-1.5">
      {label && <FormLabel htmlFor={name}>{label}</FormLabel>}

      <input
        id={name}
        {...register(name)}
        {...props}
        className={clsx(
          "bg-surface border-border text-text placeholder:text-text-3",
          "focus:border-accent focus:ring-accent/20",
          "w-full rounded-lg border px-3 py-2.5",
          "outline-none transition-all",
          "focus:ring-4",
          typeof error === "string" &&
            "border-danger focus:border-danger focus:ring-danger/20",
          className,
        )}
      />

      {typeof error === "string" && <FormError>{error}</FormError>}
    </div>
  );
}
