"use client";

import { Minus, Plus } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm, type Resolver } from "react-hook-form";
import toast from "react-hot-toast";

import { useGetStaffMenuItems } from "@/src/features/menu-items/hooks/use-get-staff-menu-items";
import { useGetMenuItems } from "@/src/features/menu-items/hooks/use-get-menu-items";
import { useGetRestaurantSettings } from "@/src/features/restaurants/hooks/use-get-restaurant-settings";
import { useGetStaffRestaurantCurrency } from "@/src/features/restaurants/hooks/use-get-staff-restaurant-currency";
import { Form, FormInput, FormSubmit } from "@/src/shared/components/forms";
import { formatMoney } from "@/src/shared/utils/format-money";

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
  const isStaffMode = mode === "staff";
  const adminMenuItems = useGetMenuItems(!isStaffMode);
  const staffMenuItems = useGetStaffMenuItems(isStaffMode);
  const { data: restaurantSettings } = useGetRestaurantSettings(!isStaffMode);
  const { data: staffRestaurantCurrency } =
    useGetStaffRestaurantCurrency(isStaffMode);
  const [search, setSearch] = useState("");

  const currency = isStaffMode
    ? staffRestaurantCurrency?.data?.currency
    : restaurantSettings?.data?.currency;

  const menuItems =
    isStaffMode
      ? (staffMenuItems.data ?? [])
      : (adminMenuItems.data ?? []);

  const visibleMenuItems = menuItems.filter((item) => {
    const matchesCategory = item.menu_categories?.is_active !== false;
    const matchesSearch = item.name
      .toLowerCase()
      .includes(search.trim().toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const form = useForm<CreateTableOrderInput>({
    resolver: zodResolver(
      CreateTableOrderSchema,
    ) as Resolver<CreateTableOrderInput>,
    defaultValues: {
      tableId,
      notes: "",
      items: [],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const adminCreateOrder = useCreateTableOrder();
  const staffCreateOrder = useCreateStaffTableOrder();

  const mutate =
    isStaffMode ? staffCreateOrder.mutate : adminCreateOrder.mutate;

  const isPending =
    isStaffMode ? staffCreateOrder.isPending : adminCreateOrder.isPending;

  const quantitiesByItemId = useMemo(() => {
    return fields.reduce<Record<string, number>>((acc, item) => {
      acc[item.menuItemId] = item.quantity;
      return acc;
    }, {});
  }, [fields]);

  const getFieldIndexByMenuItemId = (menuItemId: string) =>
    fields.findIndex((item) => item.menuItemId === menuItemId);

  const increaseQuantity = (menuItemId: string) => {
    const index = getFieldIndexByMenuItemId(menuItemId);

    if (index === -1) {
      append({
        menuItemId,
        quantity: 1,
        notes: "",
      });

      return;
    }

    const item = fields[index];

    update(index, {
      menuItemId: item.menuItemId,
      quantity: item.quantity + 1,
      notes: item.notes ?? "",
    });
  };

  const decreaseQuantity = (menuItemId: string) => {
    const index = getFieldIndexByMenuItemId(menuItemId);

    if (index === -1) {
      return;
    }

    const item = fields[index];

    if (item.quantity <= 1) {
      remove(index);
      return;
    }

    update(index, {
      menuItemId: item.menuItemId,
      quantity: item.quantity - 1,
      notes: item.notes ?? "",
    });
  };

  const onSubmit = (input: CreateTableOrderInput) => {
    if (input.items.length === 0) {
      toast.error("Seleccioná al menos un item");
      return;
    }

    mutate(input, {
      onSuccess: (response) => {
        if (response.error) {
          return;
        }

        form.reset({
          tableId,
          notes: "",
          items: [],
        });

        onSuccess?.();
      },
    });
  };

  const selectedItemsCount = fields.reduce(
    (total, item) => total + item.quantity,
    0,
  );

  const orderTotal = fields.reduce((total, field) => {
    const menuItem = visibleMenuItems.find(
      (item) => item.id === field.menuItemId,
    );

    return total + (menuItem?.price ?? 0) * field.quantity;
  }, 0);

  const updateItemNotes = (menuItemId: string, notes: string) => {
    const index = getFieldIndexByMenuItemId(menuItemId);

    if (index === -1) {
      return;
    }

    const item = fields[index];

    update(index, {
      menuItemId: item.menuItemId,
      quantity: item.quantity,
      notes,
    });
  };

  const groupedMenuItems = visibleMenuItems.reduce<
    Record<string, typeof visibleMenuItems>
  >((groups, item) => {
    const category = item.menu_categories?.name ?? "Sin categoría";

    if (!groups[category]) {
      groups[category] = [];
    }

    groups[category].push(item);

    return groups;
  }, {});

  return (
    <Form form={form} onSubmit={onSubmit} className="space-y-4">
      <FormInput
        name="menuSearch"
        label="Buscar plato"
        placeholder="Pizza, pasta, bebida..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />
      <div className="max-h-105 space-y-3 overflow-y-auto pr-1">
        {Object.entries(groupedMenuItems).map(([categoryName, items]) => (
          <div key={categoryName} className="space-y-3">
            <div className="sticky top-0 z-10 rounded-lg bg-background px-2 py-2">
              <h3 className="text-sm font-semibold text-foreground">
                {categoryName}
              </h3>
            </div>

            {items.map((item) => {
              const quantity = quantitiesByItemId[item.id] ?? 0;

              return (
                <div
                  key={item.id}
                  className="rounded-xl border border-border bg-surface p-3">
                  <div className="flex items-center gap-3">
                    <div className="relative h-16 w-16 shrink-0">
                      {item.image_url ? (
                        <Image
                          src={item.image_url}
                          alt={item.name}
                          width={64}
                          height={64}
                          unoptimized
                          className="h-16 w-16 rounded-lg object-cover"
                        />
                      ) : (
                        <div className="flex h-16 w-16 items-center justify-center rounded-lg border border-border text-xs text-muted-foreground">
                          Sin foto
                        </div>
                      )}

                      {quantity > 0 && (
                        <span className="absolute -right-2 -top-2 flex size-6 items-center justify-center rounded-full bg-foreground text-xs font-semibold text-background">
                          {quantity}
                        </span>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-foreground">
                        {item.name}
                      </p>

                      {item.description && (
                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                          {item.description}
                        </p>
                      )}

                      <p className="mt-1 text-sm font-medium text-foreground">
                        {formatMoney(item.price, currency)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={quantity === 0 || isPending}
                        onClick={() => decreaseQuantity(item.id)}
                        className="flex size-8 items-center justify-center rounded-lg border border-border disabled:cursor-not-allowed disabled:opacity-40">
                        <Minus className="size-4" />
                      </button>

                      <span className="w-6 text-center text-sm font-medium text-foreground">
                        {quantity}
                      </span>

                      <button
                        type="button"
                        disabled={!item.is_available || isPending}
                        onClick={() => increaseQuantity(item.id)}
                        className="flex size-8 items-center justify-center rounded-lg border border-border disabled:cursor-not-allowed disabled:opacity-40">
                        <Plus className="size-4" />
                      </button>
                    </div>
                  </div>

                  {!item.is_available && (
                    <p className="mt-2 text-xs text-muted-foreground">
                      No disponible
                    </p>
                  )}
                  {quantity > 0 && (
                    <div className="mt-3">
                      <FormInput
                        name={`items.${getFieldIndexByMenuItemId(item.id)}.notes`}
                        label="Notas del plato"
                        placeholder="Sin cebolla, extra queso..."
                        value={
                          fields[getFieldIndexByMenuItemId(item.id)]?.notes ??
                          ""
                        }
                        onChange={(event) =>
                          updateItemNotes(item.id, event.target.value)
                        }
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <FormInput
        name="notes"
        label="Nota general"
        placeholder="Observaciones del pedido"
      />

      <div className="sticky bottom-0 space-y-3 border-t border-border bg-surface pt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {selectedItemsCount} productos seleccionados
          </span>

          <span className="font-medium text-foreground">
            Total: {formatMoney(orderTotal, currency)}
          </span>
        </div>

        <FormSubmit
          value="Crear pedido"
          loadingText="Creando pedido..."
          disabled={isPending}
        />
      </div>
    </Form>
  );
}

