"use client";

import { useUpdateMenuItemAvailability } from "../hooks/use-update-menu-item-availability";
import { MenuItem } from "../types/menu-item.types";

type MenuItemsListProps = {
  items: MenuItem[];
};

export function MenuItemsList({ items }: MenuItemsListProps) {
  const { mutate, isPending } = useUpdateMenuItemAvailability();

  if (items.length === 0) {
    return (
      <div className="flex min-h-[320px] items-center justify-center rounded-2xl border border-border bg-background text-sm text-muted-foreground">
        Todavía no hay items creados.
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {items.map((item) => (
        <div
          key={item.id}
          className="rounded-2xl border border-border bg-background p-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
                {item.category}
              </p>

              <h3 className="mt-1 text-sm font-medium text-foreground">
                {item.name}
              </h3>

              {item.description && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.description}
                </p>
              )}
            </div>

            <div className="text-right">
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
                className="mt-2 rounded-lg border border-border px-3 py-2 text-xs font-medium text-foreground disabled:cursor-not-allowed disabled:opacity-40">
                {item.is_available ? "Disponible" : "No disponible"}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

