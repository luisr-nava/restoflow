"use client";

import { ErrorState } from "@/src/shared/components/states";
import { Card } from "@/src/shared/components/ui/Card";
import { Skeleton } from "@/src/shared/components/ui/Skeleton";
import { CreateMenuCategoryModal } from "./create-menu-category-modal";
import { MenuCategoriesList } from "./menu-categories-list";

import { useGetMenuCategories } from "../hooks/use-get-menu-categories";

function MenuCategoriesLoadingSkeleton() {
  return (
    <div className="grid gap-3">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index} variant="default" size="lg" className="p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="space-y-2">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-3 w-20" />
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-7 w-20 rounded-full" />
              <Skeleton className="h-8 w-8 rounded-lg" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

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
        <MenuCategoriesLoadingSkeleton />
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
