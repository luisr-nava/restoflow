"use client";

import Image from "next/image";

import { EmptyState } from "@/src/shared/components/states";
import {
  ActionMenu,
  ActionMenuItem,
} from "@/src/shared/components/ui/ActionMenu";
import { useUiModalStore } from "@/src/shared/stores/ui-modal.store";
import { formatMoney } from "@/src/shared/utils/format-money";
import { DeleteMenuItemButton } from "./delete-menu-item-button";
import { UpdateMenuItemModal } from "./update-menu-item-modal";
import { useUpdateMenuItemAvailability } from "../hooks/use-update-menu-item-availability";
import type { MenuItemWithCategory } from "../types/menu-item.types";

type MenuItemsListProps = {
  items: MenuItemWithCategory[];
};

export function MenuItemsList({ items }: MenuItemsListProps) {
  const { mutate, isPending } = useUpdateMenuItemAvailability();
  const openModal = useUiModalStore((state) => state.openModal);

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
                <Image
                  src={item.image_url}
                  alt={item.name}
                  width={56}
                  height={56}
                  unoptimized
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
              <p className="font-mono text-sm font-medium">
                {formatMoney(item.price)}
              </p>

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

              <ActionMenu ariaLabel={`Acciones de ${item.name}`}>
                <ActionMenuItem
                  onClick={() =>
                    openModal("editMenuItem", { menuItemId: item.id })
                  }>
                  Editar
                </ActionMenuItem>

                <ActionMenuItem
                  onClick={() =>
                    openModal("deleteMenuItem", { menuItemId: item.id })
                  }
                  tone="danger">
                  Eliminar
                </ActionMenuItem>
              </ActionMenu>

              <UpdateMenuItemModal item={item} showTrigger={false} />

              <DeleteMenuItemButton item={item} showTrigger={false} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
