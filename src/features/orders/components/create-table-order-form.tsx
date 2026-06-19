"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm, type Resolver } from "react-hook-form";
import toast from "react-hot-toast";

import {
  Form,
  FormInput,
  FormSelect,
  FormSubmit,
} from "@/src/shared/components/forms";
import { useGetStaffMenuItems } from "@/src/features/menu-items/hooks/use-get-staff-menu-items";

import { useGetMenuItems } from "@/src/features/menu-items/hooks/use-get-menu-items";
import { useCreateStaffTableOrder } from "../hooks/use-create-staff-table-order";
import { useCreateTableOrder } from "../hooks/use-create-table-order";
import { CreateTableOrderSchema } from "../schemas/order.schema";
import type { CreateTableOrderInput } from "../types/order.types";

type CreateTableOrderFormProps = {
  tableId: string;
  onSuccess?: () => void;
  mode?: "admin" | "staff";
};

export function CreateTableOrderForm({
  tableId,
  onSuccess,
  mode = "admin",
}: CreateTableOrderFormProps) {
  const [expandedIndex, setExpandedIndex] = useState(0);

  const adminMenuItems = useGetMenuItems();
  const staffMenuItems = useGetStaffMenuItems();

  const menuItems =
    mode === "staff"
      ? (staffMenuItems.data ?? [])
      : (adminMenuItems.data ?? []);

  const form = useForm<CreateTableOrderInput>({
    resolver: zodResolver(
      CreateTableOrderSchema,
    ) as Resolver<CreateTableOrderInput>,
    defaultValues: {
      tableId,
      notes: "",
      items: [
        {
          menuItemId: "",
          quantity: 1,
          notes: "",
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const adminCreateOrder = useCreateTableOrder();
  const staffCreateOrder = useCreateStaffTableOrder();

  const mutate =
    mode === "staff" ? staffCreateOrder.mutate : adminCreateOrder.mutate;

  const isPending =
    mode === "staff" ? staffCreateOrder.isPending : adminCreateOrder.isPending;

  const items = form.watch("items");

  const onAddItem = async () => {
    const lastIndex = fields.length - 1;
    const isValid = await form.trigger(`items.${lastIndex}`);

    if (!isValid) {
      toast.error("Completá el item antes de agregar otro");
      setExpandedIndex(lastIndex);
      return;
    }

    append({
      menuItemId: "",
      quantity: 1,
      notes: "",
    });

    setExpandedIndex(fields.length);
  };

  const onSubmit = (input: CreateTableOrderInput) => {
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
      <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
        {fields.map((field, index) => {
          const currentItem = items[index];
          const menuItem = menuItems.find(
            (item) => item.id === currentItem?.menuItemId,
          );
          const isCompleted = Boolean(
            currentItem?.menuItemId && currentItem.quantity > 0,
          );
          const isExpanded = expandedIndex === index || !isCompleted;

          return (
            <div key={field.id} className="rounded-xl border border-border p-4">
              {!isExpanded ? (
                <button
                  type="button"
                  onClick={() => setExpandedIndex(index)}
                  className="flex w-full items-center justify-between gap-3 text-left">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {menuItem?.name}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Cantidad: {currentItem.quantity}
                    </p>
                  </div>

                  <span className="text-xs text-muted-foreground">Editar</span>
                </button>
              ) : (
                <div className="space-y-3">
                  <FormSelect
                    name={`items.${index}.menuItemId`}
                    label="Item"
                    defaultValue="">
                    <option value="">Seleccionar item</option>

                    {menuItems.map((item) => (
                      <option
                        key={item.id}
                        value={item.id}
                        disabled={!item.is_available}>
                        {item.name}
                        {!item.is_available ? " - No disponible" : ""}
                      </option>
                    ))}
                  </FormSelect>

                  <FormInput
                    name={`items.${index}.quantity`}
                    label="Cantidad"
                    type="number"
                    placeholder="1"
                  />

                  <FormInput
                    name={`items.${index}.notes`}
                    label="Notas"
                    placeholder="Sin cebolla, extra queso..."
                  />

                  <div className="flex justify-between gap-3">
                    {isCompleted && (
                      <button
                        type="button"
                        onClick={() => setExpandedIndex(-1)}
                        className="text-sm text-muted-foreground">
                        Contraer
                      </button>
                    )}

                    {fields.length > 1 && (
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        className="ml-auto text-sm text-destructive">
                        Eliminar item
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onAddItem}
        className="rounded-lg border border-border px-4 py-2 text-sm">
        Agregar item
      </button>

      <FormInput
        name="notes"
        label="Nota general"
        placeholder="Observaciones del pedido"
      />

      <FormSubmit
        value="Crear pedido"
        loadingText="Creando pedido..."
        disabled={isPending}
      />
    </Form>
  );
}

