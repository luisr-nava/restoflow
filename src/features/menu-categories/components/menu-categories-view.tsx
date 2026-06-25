"use client";

import { ErrorState, LoadingState } from "@/src/shared/components/states";
import { CreateMenuCategoryModal } from "./create-menu-category-modal";
import { MenuCategoriesList } from "./menu-categories-list";

import { useGetMenuCategories } from "../hooks/use-get-menu-categories";

export function MenuCategoriesView() {
  const { data: categories = [], error, isError, isLoading } =
    useGetMenuCategories();

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
        <LoadingState
          label="Cargando categorías..."
          className="min-h-[240px] flex items-center justify-center"
        />
      ) : isError ? (
        <ErrorState
          title="No se pudieron cargar las categorías"
          description={error.message}
          className="min-h-[240px] flex items-center justify-center"
        />
      ) : (
        <MenuCategoriesList categories={categories} />
      )}
    </section>
  );
}
