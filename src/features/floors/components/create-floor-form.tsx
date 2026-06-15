"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useCreateFloor } from "../hooks/use-create-floor";
import { CreateFloorSchema } from "../schemas/floor.schema";
import type { CreateFloorInput } from "../types/floor.types";
import { Form, FormInput, FormSubmit } from "@/src/shared/components/forms";

type CreateFloorFormProps = {
  onSuccess?: () => void;
};

export function CreateFloorForm({ onSuccess }: CreateFloorFormProps) {
  const form = useForm<CreateFloorInput>({
    resolver: zodResolver(CreateFloorSchema),
    defaultValues: {
      name: "",
    },
  });

  const { mutate, isPending } = useCreateFloor();

  const onSubmit = (input: CreateFloorInput) => {
    mutate(input, {
      onSuccess: () => {
        form.reset();
        onSuccess?.();
      },
    });
  };

  return (
    <Form form={form} onSubmit={onSubmit} className="space-y-4">
      <FormInput
        name="name"
        label="Nombre del piso"
        placeholder="Ej: Planta baja"
      />

      <FormSubmit
        value="Crear piso"
        loadingText="Creando..."
        disabled={isPending}
      />
    </Form>
  );
}
