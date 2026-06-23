"use client";

import { useUiModalStore } from "@/src/shared/stores/ui-modal.store";
import { CreateMenuItemForm } from "./create-menu-item-form";

type CreateMenuItemModalProps = {
  openText?: string;
  showTrigger?: boolean;
};

export function CreateMenuItemModal({
  openText = "Crear item",
  showTrigger = true,
}: CreateMenuItemModalProps) {
  const openModal = useUiModalStore((state) => state.openModal);
  const closeModal = useUiModalStore((state) => state.closeModal);
  const open = useUiModalStore(
    (state) => state.modals.createMenuItem?.open ?? false,
  );

  return (
    <>
      {showTrigger && (
        <button
          type="button"
          onClick={() => openModal("createMenuItem")}
          className="rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-muted">
          {openText}
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Crear item
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Agregá un producto al menú del restaurante.
                </p>
              </div>

              <button
                type="button"
                onClick={() => closeModal("createMenuItem")}
                className="text-sm text-muted-foreground hover:text-foreground">
                Cerrar
              </button>
            </div>

            <CreateMenuItemForm onSuccess={() => closeModal("createMenuItem")} />
          </div>
        </div>
      )}
    </>
  );
}
