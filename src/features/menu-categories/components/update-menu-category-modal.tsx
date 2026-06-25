"use client";

import { AppDialog } from "@/src/shared/components/ui/AppDialog";
import { useUiModalStore } from "@/src/shared/stores/ui-modal.store";
import type { MenuCategory } from "../types/menu-category.types";
import { UpdateMenuCategoryForm } from "./update-menu-category-form";

type UpdateMenuCategoryModalProps = {
  category: MenuCategory;
  showTrigger?: boolean;
};

export function UpdateMenuCategoryModal({
  category,
  showTrigger = true,
}: UpdateMenuCategoryModalProps) {
  const openModal = useUiModalStore((state) => state.openModal);
  const closeModal = useUiModalStore((state) => state.closeModal);
  const open = useUiModalStore(
    (state) =>
      state.modals.editMenuCategory?.open === true &&
      state.modals.editMenuCategory?.payload?.categoryId === category.id,
  );

  return (
    <>
      {showTrigger && (
        <button
          type="button"
          onClick={() => openModal("editMenuCategory", { categoryId: category.id })}
          className="rounded-lg border border-border px-3 py-2 text-xs font-medium">
          Editar
        </button>
      )}

      <AppDialog
        open={open}
        onClose={() => closeModal("editMenuCategory")}
        title={
          <>
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Categoría
            </span>
            <span className="mt-1 block text-lg font-medium text-foreground">
              Editar categoría
            </span>
          </>
        }
        size="md">
        <UpdateMenuCategoryForm
          category={category}
          onSuccess={() => closeModal("editMenuCategory")}
        />
      </AppDialog>
    </>
  );
}
