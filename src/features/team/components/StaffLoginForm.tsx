"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Form, FormInput, FormSubmit } from "@/src/shared/components/forms";

import { StaffLoginSchema } from "../schemas/staff-auth.schema";
import { useStaffLogin } from "../hooks/use-staff-login";
import type { StaffLoginInput } from "../types/staff-auth.types";

export function StaffLoginForm() {
  const form = useForm<StaffLoginInput>({
    resolver: zodResolver(StaffLoginSchema),
    defaultValues: {
      email: "",
      pin: "",
    },
  });

  const { mutate } = useStaffLogin();

  const onSubmit = (values: StaffLoginInput) => {
    mutate(values);
  };

  return (
    <Form form={form} onSubmit={onSubmit} className="space-y-4">
      <FormInput
        name="email"
        label="Email"
        placeholder="Ingresá tu email"
        type="email"
      />

      <FormInput
        name="pin"
        label="PIN"
        placeholder="Ingresá tu PIN"
        type="password"
      />

      <FormSubmit value="Ingresar" loadingText="Ingresando..." />
    </Form>
  );
}

