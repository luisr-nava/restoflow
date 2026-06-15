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
import { useSetPassword } from "../hooks/use-set-password";
import { SetPasswordSchema } from "../schemas/auth.schema";
import type { SetPasswordInput } from "../types/auth.types";

export function SetPasswordForm() {
  const form = useForm<SetPasswordInput>({
    resolver: zodResolver(SetPasswordSchema),
    defaultValues: {
      newPassword: "",
      passwordConfirmation: "",
    },
  });
  const { mutateAsync: setPassword } = useSetPassword();

  const onSubmit = async (data: SetPasswordInput) => {
    await setPassword(data);
    redirect("/auth/sign-in");
  };

  return (
    <Form form={form} onSubmit={onSubmit} className="w-full">
      <FormInput
        name="newPassword"
        type="password"
        label="Nueva contraseña"
        placeholder="Ingresá tu nueva contraseña"
      />

      <FormInput
        name="passwordConfirmation"
        type="password"
        label="Confirmar contraseña"
        placeholder="Repetí tu nueva contraseña"
        className="mt-4"
      />

      {form.formState.errors.root?.message && (
        <FormError>{form.formState.errors.root.message}</FormError>
      )}

      <FormSubmit value="Actualizar contraseña" loadingText="Actualizando..." />
    </Form>
  );
}

