"use client";

import { useDeleteMenuCategory } from "../hooks/use-delete-menu-category";
import type { MenuCategory } from "../types/menu-category.types";

type MenuCategoriesListProps = {
  categories: MenuCategory[];
};

export function MenuCategoriesList({ categories }: MenuCategoriesListProps) {
  const { mutate, isPending } = useDeleteMenuCategory();

  if (categories.length === 0) {
    return (
      <div className="flex min-h-[240px] items-center justify-center rounded-2xl border border-border bg-background text-sm text-muted-foreground">
        Todavía no hay categorías creadas.
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {categories.map((category) => (
        <div
          key={category.id}
          className="rounded-2xl border border-border bg-background p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-medium text-foreground">
                {category.name}
              </h3>

              <p className="mt-1 font-mono text-xs text-muted-foreground">
                Orden: {category.sort_order}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`rounded-full px-2 py-1 font-mono text-[10px] uppercase ${
                  category.is_active
                    ? "border border-green-200 text-green-600"
                    : "border border-border text-muted-foreground"
                }`}>
                {category.is_active ? "Activa" : "Inactiva"}
              </span>

              <button
                type="button"
                disabled={isPending}
                onClick={() => mutate(category.id)}
                className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 disabled:cursor-not-allowed disabled:opacity-40">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
