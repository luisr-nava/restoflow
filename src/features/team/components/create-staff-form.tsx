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
import { useGetStaffTables } from "../../tables/hooks/use-get-staff-tables";

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
      tableIds: [],
    },
  });

  const { mutate, isPending } = useCreateStaff();
  const selectedRole = form.watch("role");
  const { data: tables = [] } = useGetStaffTables();
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
          tableIds: [],
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
      {selectedRole === "WAITER" && (
        <div className="space-y-2 rounded-xl border border-border p-3">
          <p className="text-sm font-medium text-foreground">Mesas asignadas</p>

          {tables.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Todavía no hay mesas creadas.
            </p>
          ) : (
            <div className="grid gap-2">
              {tables.map((table) => (
                <label
                  key={table.id}
                  className="flex items-center gap-2 text-sm text-muted-foreground">
                  <input
                    type="checkbox"
                    value={table.id}
                    {...form.register("tableIds")}
                  />

                  <span>
                    {table.name} · {table.status}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}
      <FormSubmit
        value="Crear personal"
        loadingText="Creando..."
        disabled={isPending}
      />
    </Form>
  );
}


