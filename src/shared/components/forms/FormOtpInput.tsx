"use client";

import clsx from "clsx";
import { useEffect, useRef } from "react";
import { useFormContext, useWatch } from "react-hook-form";

import { FormError } from "./FormError";
import { FormLabel } from "./FormLabel";

type Props = {
  name: string;
  label?: string;
  length?: number;
};

export function FormOtpInput({ name, label, length = 6 }: Props) {
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);
  const {
    setValue,
    formState: { errors },
  } = useFormContext();

  const rawValue = String(useWatch({ name }) ?? "");
  const value = rawValue.slice(0, length);
  const error = errors[name]?.message;

  useEffect(() => {
    if (rawValue === value) {
      return;
    }

    setValue(name, value);
  }, [length, name, rawValue, setValue, value]);

  function updateValue(nextValue: string) {
    setValue(name, nextValue, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: nextValue.length === length,
    });
  }

  function handleChange(index: number, inputValue: string) {
    const digit = inputValue.replace(/\D/g, "").slice(-1);
    const next = value.split("");

    next[index] = digit;

    const nextValue = next.join("").slice(0, length);
    updateValue(nextValue);

    if (digit && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(
    index: number,
    event: React.KeyboardEvent<HTMLInputElement>,
  ) {
    if (event.key === "Backspace" && !value[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  }

  function handlePaste(event: React.ClipboardEvent<HTMLInputElement>) {
    event.preventDefault();

    const pastedValue = event.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length);

    updateValue(pastedValue);

    const nextIndex = Math.min(pastedValue.length, length - 1);
    inputsRef.current[nextIndex]?.focus();
  }

  return (
    <div className="space-y-2">
      {label && <FormLabel>{label}</FormLabel>}

      <div className="flex justify-center gap-2 sm:gap-3">
        {Array.from({ length }).map((_, index) => (
          <input
            key={index}
            ref={(element) => {
              inputsRef.current[index] = element;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={value[index] ?? ""}
            onChange={(event) => handleChange(index, event.target.value)}
            onKeyDown={(event) => handleKeyDown(index, event)}
            onPaste={handlePaste}
            className={clsx(
              "h-12 w-10 rounded-lg border border-border bg-surface text-center font-mono text-lg text-text outline-none transition-all sm:h-14 sm:w-12",
              "focus:border-accent focus:ring-4 focus:ring-accent/20",
              typeof error === "string" &&
                "border-danger focus:border-danger focus:ring-danger/20",
            )}
          />
        ))}
      </div>

      {typeof error === "string" && <FormError>{error}</FormError>}
    </div>
  );
}
