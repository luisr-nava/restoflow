"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Form, FormInput, FormSubmit } from "@/src/shared/components/forms";
import { SignUpInput } from "../types/auth.types";
import { SignUpSchema } from "../schemas/auth.schema";
import { useSignUp } from "../hooks/use-sign-up";

export function SignUpForm() {
  const { mutateAsync } = useSignUp();
  const form = useForm<SignUpInput>({
    resolver: zodResolver(SignUpSchema),
    mode: "all",
    defaultValues: {
      name: "",
      email: "",
      password: "",
      passwordConfirmation: "",
    },
  });

  const onSubmit = async (data: SignUpInput) => {
    await mutateAsync(data);
  };

  return (
    <Form form={form} onSubmit={onSubmit} className="w-full max-w-md">
      <FormInput name="name" label="Nombre" placeholder="Luis González" />

      <FormInput
        name="email"
        label="E-mail"
        type="email"
        placeholder="correo@ejemplo.com"
      />

      <FormInput name="password" label="Contraseña" type="password" />

      <FormInput
        name="passwordConfirmation"
        label="Confirmar contraseña"
        type="password"
      />

      <FormSubmit value="Crear cuenta" loadingText="Creando cuenta..." />
    </Form>
  );
}

