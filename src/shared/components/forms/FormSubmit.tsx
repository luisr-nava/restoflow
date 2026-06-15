"use client";

import clsx from "clsx";
import type { InputHTMLAttributes } from "react";
import { useFormContext } from "react-hook-form";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  loadingText?: string;
};

export function FormSubmit({
  value = "Guardar",
  loadingText = "Guardando...",
  disabled,
  className,
  ...props
}: Props) {
  const {
    formState: { isSubmitting },
  } = useFormContext();

  return (
    <input
      type="submit"
      value={isSubmitting ? loadingText : value}
      disabled={disabled || isSubmitting}
      className={clsx(
        "w-full rounded-lg bg-text px-4 py-3 text-sm font-medium text-bg",
        "cursor-pointer transition-opacity hover:opacity-90",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
}

