"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";

import {
  Form,
  FormInput,
  FormSelect,
  FormSubmit,
} from "@/src/shared/components/forms";

import { useCreateStaff } from "../hooks/use-create-staff";
import { CreateStaffSchema } from "../schemas/team.schema";
import type { CreateStaffInput } from "../types/team.types";

type CreateStaffFormProps = {
  onSuccess?: () => void;
};

export function CreateStaffForm({ onSuccess }: CreateStaffFormProps) {
  const form = useForm<CreateStaffInput>({
    resolver: zodResolver(CreateStaffSchema) as Resolver<CreateStaffInput>,
    defaultValues: {
      name: "",
      email: "",
      role: "WAITER",
      pin: "",
    },
  });

  const { mutate, isPending } = useCreateStaff();

  const onSubmit = (input: CreateStaffInput) => {
    mutate(input, {
      onSuccess: (response) => {
        if (response.error) {
          return;
        }

        form.reset({
          name: "",
          email: "",
          role: "WAITER",
          pin: "",
        });

        onSuccess?.();
      },
    });
  };

  return (
    <Form form={form} onSubmit={onSubmit} className="space-y-4">
      <FormInput name="name" label="Nombre" placeholder="Ej: Juan Pérez" />

      <FormInput name="email" label="Email" placeholder="Ej: juan@email.com" />

      <FormSelect name="role" label="Rol">
        <option value="WAITER">Mozo</option>
        <option value="KITCHEN">Cocina</option>
      </FormSelect>

      <FormInput
        name="pin"
        label="PIN"
        placeholder="Ej: 1234"
        type="password"
      />

      <FormSubmit
        value="Crear personal"
        loadingText="Creando..."
        disabled={isPending}
      />
    </Form>
  );
}
