"use client";

import { CreateMenuCategoryModal } from "./create-menu-category-modal";
import { MenuCategoriesList } from "./menu-categories-list";

import { useGetMenuCategories } from "../hooks/use-get-menu-categories";

export function MenuCategoriesView() {
  const { data: categories = [], isLoading } = useGetMenuCategories();

  return (
    <section className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Categories
          </p>

          <h2 className="mt-2 text-xl font-semibold tracking-tight">
            Categorías del menú
          </h2>
        </div>

        <CreateMenuCategoryModal />
      </div>

      {isLoading ? (
        <div className="flex min-h-[240px] items-center justify-center rounded-2xl border border-border bg-background text-sm text-muted-foreground">
          Cargando categorías...
        </div>
      ) : (
        <MenuCategoriesList categories={categories} />
      )}
    </section>
  );
}
