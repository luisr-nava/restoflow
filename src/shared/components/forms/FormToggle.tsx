"use client";

import type { InputHTMLAttributes } from "react";
import { useFormContext } from "react-hook-form";

import { FormError } from "./FormError";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  name: string;
};

export function FormToggle({ name, ...props }: Props) {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message;

  return (
    <div className="space-y-1.5">
      <div
        className="
          group relative inline-flex w-11 shrink-0 rounded-full
          bg-surface-3 p-0.5
          outline-offset-2 outline-accent
          transition-colors duration-200 ease-in-out
          has-checked:bg-accent
          has-focus-visible:outline-2
        ">
        <span
          className="
            size-5 rounded-full
            bg-surface
            shadow-sm
            ring-1 ring-border
            transition-transform duration-200 ease-in-out
            group-has-checked:translate-x-5
          "
        />

        <input
          type="checkbox"
          className="absolute inset-0 appearance-none focus:outline-none"
          {...register(name)}
          {...props}
        />
      </div>

      {typeof error === "string" && <FormError>{error}</FormError>}
    </div>
  );
}
