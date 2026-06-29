"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Form, FormOtpInput, FormSubmit } from "@/src/shared/components/forms";
import { Button } from "@/src/shared/components/ui/Button";

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

      <Button type="button" variant="link" size="md" onClick={onResend}>
        No recibiste el código?
      </Button>
    </Form>
  );
}
