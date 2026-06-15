"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Form, FormOtpInput, FormSubmit } from "@/src/shared/components/forms";

import { VerifyEmailSchema } from "../schemas/auth.schema";
import { VerifyEmailInput } from "../types/auth.types";
import { useVerifyEmail } from "../hooks/use-verify-email";

type Props = {
  onResend: () => void;
};

export function VerifyEmailForm({ onResend }: Props) {
  const form = useForm<VerifyEmailInput>({
    resolver: zodResolver(VerifyEmailSchema),
    mode: "onSubmit",
    defaultValues: {},
  });

  const { mutateAsync } = useVerifyEmail();

  const onSubmit = async (data: VerifyEmailInput) => {
    await mutateAsync(data);
  };

  return (
    <Form form={form} onSubmit={onSubmit} className="w-full space-y-4">
      <FormOtpInput name="token" length={6} />

      <FormSubmit value="Verificar cuenta" loadingText="Verificando..." />

      <button
        type="button"
        onClick={onResend}
        className="text-sm text-muted-foreground underline">
        No recibiste el código?
      </button>
    </Form>
  );
}
