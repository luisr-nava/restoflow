"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { redirect } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  Form,
  FormError,
  FormInput,
  FormSubmit,
} from "@/src/shared/components/forms";
import { useForgotPassword } from "../hooks/use-forgot-password";
import { ForgotPasswordSchema } from "../schemas/auth.schema";
import type { ForgotPasswordInput } from "../types/auth.types";

export function ForgotPasswordForm() {
  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(ForgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });
  const { mutateAsync: forgotPassword } = useForgotPassword();

  const onSubmit = async (data: ForgotPasswordInput) => {
    await forgotPassword(data);
    redirect("/auth/sign-in");
  };

  return (
    <Form form={form} onSubmit={onSubmit} className="w-full">
      <FormInput
        name="email"
        type="email"
        label="Email"
        placeholder="Ingresá tu email"
      />

      {form.formState.errors.root?.message && (
        <FormError>{form.formState.errors.root.message}</FormError>
      )}

      <FormSubmit value="Enviar instrucciones" loadingText="Enviando..." />
    </Form>
  );
}

