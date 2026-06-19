"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";

import { useUpdateTable } from "../hooks/use-update-table";
import { UpdateTableSchema } from "../schemas/table.schema";
import type { RestaurantTable, UpdateTableInput } from "../types/table.types";
import {
  Form,
  FormInput,
  FormSelect,
  FormSubmit,
} from "@/src/shared/components/forms";
import { useGetStaff } from "@/src/features/team/hooks/use-get-staff";

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
  const { data: staff = [] } = useGetStaff();

  const waiterOptions = staff
    .filter((member) => member.role === "WAITER" && member.is_active)
    .map((member) => ({
      label: member.name,
      value: member.id,
    }));

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

      <FormSelect name="waiterId" label="Mozo asignado">
        <option value="">Sin mozo asignado</option>

        {waiterOptions.map((waiter) => (
          <option key={waiter.value} value={waiter.value}>
            {waiter.label}
          </option>
        ))}
      </FormSelect>
      
      <FormSubmit
        value="Guardar cambios"
        loadingText="Guardando..."
        disabled={isPending}
      />
    </Form>
  );
}

