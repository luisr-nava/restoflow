"use client";

import { AppDialog } from "@/src/shared/components/ui/AppDialog";
import { useUiModalStore } from "@/src/shared/stores/ui-modal.store";
import { CreateMenuCategoryForm } from "./create-menu-category-form";

type CreateMenuCategoryModalProps = {
  openText?: string;
};

export function CreateMenuCategoryModal({
  openText = "Crear categoría",
}: CreateMenuCategoryModalProps) {
  const openModal = useUiModalStore((state) => state.openModal);
  const closeModal = useUiModalStore((state) => state.closeModal);
  const open = useUiModalStore(
    (state) => state.modals.createMenuCategory?.open ?? false,
  );

  return (
    <>
      <button
        type="button"
        onClick={() => openModal("createMenuCategory")}
        className="rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-muted">
        {openText}
      </button>

      <AppDialog
        open={open}
        onClose={() => closeModal("createMenuCategory")}
        title="Crear categoría"
        description="Agregá una categoría para organizar el menú."
        size="md">
        <CreateMenuCategoryForm
          onSuccess={() => closeModal("createMenuCategory")}
        />
      </AppDialog>
    </>
  );
}
