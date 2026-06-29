"use client";

import {
  ActionMenu,
  ActionMenuItem,
} from "@/src/shared/components/ui/ActionMenu";
import { EmptyState } from "@/src/shared/components/states";
import { Button } from "@/src/shared/components/ui/Button";
import { Card, CardTitle } from "@/src/shared/components/ui/Card";
import { useUiModalStore } from "@/src/shared/stores/ui-modal.store";
import { DeleteMenuCategoryButton } from "./delete-menu-category-button";
import { UpdateMenuCategoryModal } from "./update-menu-category-modal";
import { useUpdateMenuCategoryStatus } from "../hooks/use-update-menu-category-status";
import type { MenuCategory } from "../types/menu-category.types";

type MenuCategoriesListProps = {
  categories: MenuCategory[];
};

export function MenuCategoriesList({ categories }: MenuCategoriesListProps) {
  const { mutate, isPending } = useUpdateMenuCategoryStatus();
  const openModal = useUiModalStore((state) => state.openModal);

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
        <Card
          key={category.id}
          variant="default"
          size="lg"
          className="p-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <CardTitle className="text-sm font-medium">{category.name}</CardTitle>

              <p className="mt-1 font-mono text-xs text-muted-foreground">
                Orden: {category.sort_order}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant={category.is_active ? "success" : "outline"}
                size="sm"
                disabled={isPending}
                onClick={() =>
                  mutate({
                    categoryId: category.id,
                    isActive: !category.is_active,
                  })
                }
                className="rounded-full px-2 py-1 font-mono text-[10px] font-normal uppercase">
                {category.is_active ? "Activa" : "Inactiva"}
              </Button>

              <ActionMenu ariaLabel={`Acciones de ${category.name}`}>
                <ActionMenuItem
                  onClick={() =>
                    openModal("editMenuCategory", { categoryId: category.id })
                  }>
                  Editar
                </ActionMenuItem>

                <ActionMenuItem
                  onClick={() =>
                    openModal("deleteMenuCategory", { categoryId: category.id })
                  }
                  tone="danger">
                  Eliminar
                </ActionMenuItem>
              </ActionMenu>

              <UpdateMenuCategoryModal category={category} showTrigger={false} />

              <DeleteMenuCategoryButton
                category={category}
                showTrigger={false}
              />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
