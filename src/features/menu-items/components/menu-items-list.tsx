"use client";

import { EmptyState } from "@/src/shared/components/states";
import { DeleteMenuItemButton } from "./delete-menu-item-button";
import { UpdateMenuItemModal } from "./update-menu-item-modal";
import { useUpdateMenuItemAvailability } from "../hooks/use-update-menu-item-availability";
import type { MenuItem } from "../types/menu-item.types";

type MenuItemsListProps = {
  items: MenuItem[];
};

export function MenuItemsList({ items }: MenuItemsListProps) {
  const { mutate, isPending } = useUpdateMenuItemAvailability();

  if (items.length === 0) {
    return (
      <EmptyState
        title="Todavía no hay productos"
        description="Agregá el primer producto para empezar a vender."
        className="min-h-[320px] flex items-center justify-center"
      />
    );
  }

  return (
    <div className="grid gap-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="rounded-2xl border border-border bg-background p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex gap-3">
              {item.image_url && (
                <img
                  src={item.image_url}
                  alt={item.name}
                  className="h-14 w-14 rounded-xl border border-border object-cover"
                />
              )}

              <div>
                <h3 className="text-sm font-medium text-foreground">
                  {item.name}
                </h3>

                {item.description && (
                  <p className="mt-1 text-sm text-muted-foreground">
                    {item.description}
                  </p>
                )}

                <p className="mt-2 font-mono text-xs text-muted-foreground">
                  {item.menu_categories?.name ?? "Sin categoría"}{" "}
                </p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <p className="font-mono text-sm font-medium">${item.price}</p>

              <button
                type="button"
                disabled={isPending}
                onClick={() =>
                  mutate({
                    menuItemId: item.id,
                    isAvailable: !item.is_available,
                  })
                }
                className={`rounded-lg border px-3 py-2 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-40 ${
                  item.is_available
                    ? "border-green-200 text-green-600"
                    : "border-border text-muted-foreground"
                }`}>
                {item.is_available ? "Disponible" : "No disponible"}
              </button>

              <div className="flex gap-2">
                <UpdateMenuItemModal item={item} />
                <DeleteMenuItemButton item={item} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
