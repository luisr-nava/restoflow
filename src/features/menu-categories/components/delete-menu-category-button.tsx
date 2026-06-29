"use client";

import { AppDialog } from "@/src/shared/components/ui/AppDialog";
import { Button } from "@/src/shared/components/ui/Button";
import { useUiModalStore } from "@/src/shared/stores/ui-modal.store";
import { useDeleteMenuCategory } from "../hooks/use-delete-menu-category";
import type { MenuCategory } from "../types/menu-category.types";

type DeleteMenuCategoryButtonProps = {
  category: MenuCategory;
  showTrigger?: boolean;
};

export function DeleteMenuCategoryButton({
  category,
  showTrigger = true,
}: DeleteMenuCategoryButtonProps) {
  const openModal = useUiModalStore((state) => state.openModal);
  const closeModal = useUiModalStore((state) => state.closeModal);
  const open = useUiModalStore(
    (state) =>
      state.modals.deleteMenuCategory?.open === true &&
      state.modals.deleteMenuCategory?.payload?.categoryId === category.id,
  );
  const { mutate, isPending } = useDeleteMenuCategory();

  const onDelete = () => {
    mutate(category.id, {
      onSuccess: () => {
        closeModal("deleteMenuCategory");
      },
    });
  };

  return (
    <>
      {showTrigger && (
        <Button
          type="button"
          variant="danger"
          size="sm"
          onClick={() =>
            openModal("deleteMenuCategory", { categoryId: category.id })
          }
          disabled={isPending}>
          Eliminar
        </Button>
      )}

      <AppDialog
        open={open}
        onClose={() => closeModal("deleteMenuCategory")}
        title={
          <>
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Eliminar categoría
            </span>
            <span className="mt-2 block text-lg font-medium text-foreground">
              ¿Eliminar {category.name}?
            </span>
          </>
        }
        size="sm"
        footer={
          <>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => closeModal("deleteMenuCategory")}
              disabled={isPending}>
              Cancelar
            </Button>

            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={onDelete}
              disabled={isPending}>
              {isPending ? "Eliminando..." : "Eliminar"}
            </Button>
          </>
        }>
        <p className="text-sm text-muted-foreground">
          Si tiene productos asociados, no se podrá eliminar.
        </p>
      </AppDialog>
    </>
  );
}
