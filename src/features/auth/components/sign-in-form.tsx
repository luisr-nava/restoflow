"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Form, FormInput, FormSubmit } from "@/src/shared/components/forms";

import { useSignIn } from "../hooks/use-sign-in";
import { SignInSchema } from "../schemas/auth.schema";
import type { SignInInput } from "../types/auth.types";

export function SignInForm() {
  const form = useForm<SignInInput>({
    resolver: zodResolver(SignInSchema),
    mode: "all",
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutateAsync } = useSignIn();

  const onSubmit = async (data: SignInInput) => {
    await mutateAsync(data);
  };

  return (
    <Form form={form} onSubmit={onSubmit} className="w-full">
      <FormInput name="email" label="E-mail" type="email" />

      <FormInput name="password" label="Contraseña" type="password" />

      <FormSubmit value="Iniciar sesión" loadingText="Ingresando..." />
    </Form>
  );
}
