"use client";

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

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Crear categoría
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Agregá una categoría para organizar el menú.
                </p>
              </div>

              <button
                type="button"
                onClick={() => closeModal("createMenuCategory")}
                className="text-sm text-muted-foreground hover:text-foreground">
                Cerrar
              </button>
            </div>

            <CreateMenuCategoryForm
              onSuccess={() => closeModal("createMenuCategory")}
            />
          </div>
        </div>
      )}
    </>
  );
}
