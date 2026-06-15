"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";

import { useCreateTable } from "../hooks/use-create-table";
import { CreateTableSchema } from "../schemas/table.schema";
import type { CreateTableInput } from "../types/table.types";
import { Form, FormInput, FormSubmit } from "@/src/shared/components/forms";

type CreateTableFormProps = {
  floorId: string;
  onSuccess?: () => void;
};

export function CreateTableForm({ floorId, onSuccess }: CreateTableFormProps) {
  const form = useForm<CreateTableInput>({
    resolver: zodResolver(CreateTableSchema) as Resolver<CreateTableInput>,
    defaultValues: {
      floorId,
      name: "",
      seats: 2,
      waiterId: "",
    },
  });

  const { mutate, isPending } = useCreateTable();

  const onSubmit = (input: CreateTableInput) => {
    mutate(input, {
      onSuccess: () => {
        form.reset({
          floorId,
          name: "",
          seats: 2,
          waiterId: "",
        });

        onSuccess?.();
      },
    });
  };

  return (
    <Form form={form} onSubmit={onSubmit} className="space-y-4">
      <input type="hidden" {...form.register("floorId")} />

      <FormInput
        name="name"
        label="Nombre de la mesa"
        placeholder="Ej: Mesa 1"
      />

      <FormInput
        name="seats"
        label="Cantidad de sillas"
        placeholder="Ej: 4"
        type="number"
      />

      <FormSubmit
        value="Crear mesa"
        loadingText="Creando..."
        disabled={isPending}
      />
    </Form>
  );
}

