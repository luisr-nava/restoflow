"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type Resolver } from "react-hook-form";

import {
  Form,
  FormInput,
  FormSelect,
  FormSubmit,
  FormToggle,
} from "@/src/shared/components/forms";
import { useGetRestaurantTables } from "@/src/features/tables/hooks/use-get-restaurant-tables";

import { useUpdateStaff } from "../hooks/use-update-staff";
import { UpdateStaffSchema } from "../schemas/team.schema";
import type { RestaurantStaff, UpdateStaffInput } from "../types/team.types";

type UpdateStaffFormProps = {
  staff: RestaurantStaff;
  onSuccess?: () => void;
};

export function UpdateStaffForm({ staff, onSuccess }: UpdateStaffFormProps) {
  const { data: tables = [] } = useGetRestaurantTables();

  const assignedTableIds = tables
    .filter((table) => table.waiter_id === staff.id)
    .map((table) => table.id);

  const form = useForm<UpdateStaffInput>({
    resolver: zodResolver(UpdateStaffSchema) as Resolver<UpdateStaffInput>,
    defaultValues: {
      staffId: staff.id,
      name: staff.name,
      email: staff.email ?? "",
      role: staff.role,
      isActive: staff.is_active,
      pin: "",
      tableIds: assignedTableIds,
    },
  });

  const { mutate, isPending } = useUpdateStaff();

  const selectedRole = form.watch("role");

  const onSubmit = (input: UpdateStaffInput) => {
    mutate(input, {
      onSuccess: (response) => {
        if (response.error) {
          return;
        }

        onSuccess?.();
      },
    });
  };

  return (
    <Form form={form} onSubmit={onSubmit} className="space-y-4">
      <input type="hidden" {...form.register("staffId")} />

      <FormInput name="name" label="Nombre" placeholder="Ej: Juan Pérez" />

      <FormInput name="email" label="Email" placeholder="Ej: juan@email.com" />

      <FormSelect name="role" label="Rol">
        <option value="WAITER">Mozo</option>
        <option value="KITCHEN">Cocina</option>
      </FormSelect>

      <div className="flex items-center justify-between rounded-xl border border-border p-3">
        <div>
          <p className="text-sm font-medium text-foreground">Estado</p>
          <p className="text-xs text-muted-foreground">Activo / Inactivo</p>
        </div>

        <FormToggle name="isActive" />
      </div>

      <FormInput
        name="pin"
        label="Nuevo PIN"
        placeholder="Dejar vacío para no modificar"
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
                    {table.waiter_id && table.waiter_id !== staff.id
                      ? " · asignada a otro mozo"
                      : ""}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      <FormSubmit
        value="Guardar cambios"
        loadingText="Guardando..."
        disabled={isPending}
      />
    </Form>
  );
}
