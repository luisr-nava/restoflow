"use client";

import Image from "next/image";

import { EmptyState } from "@/src/shared/components/states";
import {
  ActionMenu,
  ActionMenuItem,
} from "@/src/shared/components/ui/ActionMenu";
import { Button } from "@/src/shared/components/ui/Button";
import { Card, CardTitle } from "@/src/shared/components/ui/Card";
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
        <Card
          key={item.id}
          variant="default"
          size="lg"
          className="p-4">
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
                <CardTitle className="text-sm font-medium">{item.name}</CardTitle>

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

              <Button
                type="button"
                variant={item.is_available ? "success" : "outline"}
                size="sm"
                disabled={isPending}
                onClick={() =>
                  mutate({
                    menuItemId: item.id,
                    isAvailable: !item.is_available,
                  })
                }>
                {item.is_available ? "Disponible" : "No disponible"}
              </Button>

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
        </Card>
      ))}
    </div>
  );
}
