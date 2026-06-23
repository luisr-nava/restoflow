"use client";

import { EmptyState } from "@/src/shared/components/states";
import { DeleteMenuCategoryButton } from "./delete-menu-category-button";
import { UpdateMenuCategoryModal } from "./update-menu-category-modal";
import { useUpdateMenuCategoryStatus } from "../hooks/use-update-menu-category-status";
import type { MenuCategory } from "../types/menu-category.types";

type MenuCategoriesListProps = {
  categories: MenuCategory[];
};

export function MenuCategoriesList({ categories }: MenuCategoriesListProps) {
  const { mutate, isPending } = useUpdateMenuCategoryStatus();

  if (categories.length === 0) {
    return (
      <EmptyState
        title="Todavía no hay categorías"
        description="Creá categorías para ordenar mejor tu menú."
        className="min-h-[240px] flex items-center justify-center"
      />
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
              <button
                type="button"
                disabled={isPending}
                onClick={() =>
                  mutate({
                    categoryId: category.id,
                    isActive: !category.is_active,
                  })
                }
                className={`rounded-full px-2 py-1 font-mono text-[10px] uppercase disabled:cursor-not-allowed disabled:opacity-40 ${
                  category.is_active
                    ? "border border-green-200 text-green-600"
                    : "border border-border text-muted-foreground"
                }`}>
                {category.is_active ? "Activa" : "Inactiva"}
              </button>

              <UpdateMenuCategoryModal category={category} />

              <DeleteMenuCategoryButton category={category} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
