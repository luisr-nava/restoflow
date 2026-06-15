"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";


import { useUpdateTable } from "../hooks/use-update-table";
import { UpdateTableSchema } from "../schemas/table.schema";
import type { RestaurantTable, UpdateTableInput } from "../types/table.types";
import { Form, FormInput, FormSubmit } from "@/src/shared/components/forms";

type EditTableFormProps = {
  table: RestaurantTable;
  onSuccess?: () => void;
};

export function EditTableForm({ table, onSuccess }: EditTableFormProps) {
  const form = useForm<UpdateTableInput>({
    resolver: zodResolver(UpdateTableSchema) as Resolver<UpdateTableInput>,
    defaultValues: {
      tableId: table.id,
      name: table.name,
      seats: table.seats,
      waiterId: table.waiter_id ?? "",
    },
  });

  const { mutate, isPending } = useUpdateTable();

  const onSubmit = (input: UpdateTableInput) => {
    mutate(input, {
      onSuccess: () => {
        onSuccess?.();
      },
    });
  };

  return (
    <Form form={form} onSubmit={onSubmit} className="space-y-4">
      <input type="hidden" {...form.register("tableId")} />

      <FormInput name="name" label="Nombre" placeholder="Mesa 1" />

      <FormInput name="seats" label="Cantidad de sillas" type="number" />

      <FormSubmit
        value="Guardar cambios"
        loadingText="Guardando..."
        disabled={isPending}
      />
    </Form>
  );
}
