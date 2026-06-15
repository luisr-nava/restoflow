"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Form, FormSubmit } from "@/src/shared/components/forms";

import { useResendVerification } from "../hooks/use-resend-verification";
import { ResendVerificationInput } from "../types/auth.types";
import { ResendVerificationSchema } from "../schemas/auth.schema";

type Props = {
  onBack: () => void;
};

export function ResendVerificationForm({ onBack }: Props) {
  const form = useForm<ResendVerificationInput>({
    resolver: zodResolver(ResendVerificationSchema),
    mode: "onSubmit",
    defaultValues: {
      email: "",
    },
  });

  const { mutate: resend } = useResendVerification();

  const onSubmit = (data: ResendVerificationInput) => {
    resend(data.email);
  };

  return (
    <Form form={form} onSubmit={onSubmit} className="space-y-4">
      <input
        type="email"
        placeholder="Ingresá tu email"
        {...form.register("email")}
        className="w-full rounded-lg border border-border p-2 text-sm"
      />

      {form.formState.errors.email && (
        <p className="text-sm text-danger">
          {form.formState.errors.email.message}
        </p>
      )}

      <FormSubmit value="Reenviar código" loadingText="Enviando..." />

      <button
        type="button"
        onClick={onBack}
        className="text-xs text-muted-foreground underline">
        Volver
      </button>
    </Form>
  );
}

