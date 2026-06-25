"use client";

import { AppDialog } from "@/src/shared/components/ui/AppDialog";
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
        <button
          type="button"
          onClick={() =>
            openModal("deleteMenuCategory", { categoryId: category.id })
          }
          disabled={isPending}
          className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 disabled:cursor-not-allowed disabled:opacity-40">
          Eliminar
        </button>
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
            <button
              type="button"
              onClick={() => closeModal("deleteMenuCategory")}
              disabled={isPending}
              className="rounded-lg border border-border px-3 py-2 text-xs">
              Cancelar
            </button>

            <button
              type="button"
              onClick={onDelete}
              disabled={isPending}
              className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 disabled:opacity-40">
              {isPending ? "Eliminando..." : "Eliminar"}
            </button>
          </>
        }>
        <p className="text-sm text-muted-foreground">
          Si tiene productos asociados, no se podrá eliminar.
        </p>
      </AppDialog>
    </>
  );
}
