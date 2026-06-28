"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm, useWatch, type Resolver } from "react-hook-form";
import {
  Form,
  FormInput,
  FormSelect,
  FormSubmit,
  FormToggle,
} from "@/src/shared/components/forms";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/src/shared/components/states";
import { useGetRestaurantTables } from "@/src/features/tables/hooks/use-get-restaurant-tables";

import { useUpdateStaff } from "../hooks/use-update-staff";
import { UpdateStaffSchema } from "../schemas/team.schema";
import type { RestaurantStaff, UpdateStaffInput } from "../types/team.types";

type UpdateStaffFormProps = {
  staff: RestaurantStaff;
  onSuccess?: () => void;
};

export function UpdateStaffForm({ staff, onSuccess }: UpdateStaffFormProps) {
  const {
    data: tables = [],
    error: tablesError,
    isError: isTablesError,
    isLoading: isLoadingTables,
  } = useGetRestaurantTables();

  const assignedTableIds = tables
    .filter((table) => table.waiter_id === staff.id)
    .map((table) => table.id)
    .sort();

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
  useEffect(() => {
    form.reset({
      staffId: staff.id,
      name: staff.name,
      email: staff.email ?? "",
      role: staff.role,
      isActive: staff.is_active,
      pin: "",
      tableIds: assignedTableIds,
    });
  }, [assignedTableIds, form, staff]);
  const { mutate, isPending } = useUpdateStaff();

  const selectedRole = useWatch({
    control: form.control,
    name: "role",
  });

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

          {isLoadingTables ? (
            <LoadingState
              label="Cargando mesas..."
              className="rounded-none border-0 bg-transparent p-0 text-left"
            />
          ) : isTablesError ? (
            <ErrorState
              title="No se pudieron cargar las mesas"
              description={tablesError.message}
              className="rounded-none border-0 bg-transparent p-0 text-left"
            />
          ) : tables.length === 0 ? (
            <EmptyState
              title="Todavía no hay mesas para asignar"
              description="Podés crear mesas primero y después volver a asignarlas."
              className="rounded-none border-0 bg-transparent p-0 text-left"
            />
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


