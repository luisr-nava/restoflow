"use client";

import { useUiModalStore } from "@/src/shared/stores/ui-modal.store";
import type { MenuItem } from "../types/menu-item.types";
import { UpdateMenuItemForm } from "./update-menu-item-form";

type UpdateMenuItemModalProps = {
  item: MenuItem;
};

export function UpdateMenuItemModal({ item }: UpdateMenuItemModalProps) {
  const openModal = useUiModalStore((state) => state.openModal);
  const closeModal = useUiModalStore((state) => state.closeModal);
  const open = useUiModalStore(
    (state) =>
      state.modals.editMenuItem?.open === true &&
      state.modals.editMenuItem?.payload?.menuItemId === item.id,
  );

  return (
    <>
      <button
        type="button"
        onClick={() => openModal("editMenuItem", { menuItemId: item.id })}
        className="rounded-lg border border-border px-3 py-2 text-xs font-medium">
        Editar
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-lg">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Menú
                </p>

                <h2 className="mt-1 text-lg font-medium text-foreground">
                  Editar item
                </h2>
              </div>

              <button
                type="button"
                onClick={() => closeModal("editMenuItem")}
                className="rounded-lg border border-border px-3 py-2 text-xs">
                Cerrar
              </button>
            </div>

            <UpdateMenuItemForm
              item={item}
              onSuccess={() => closeModal("editMenuItem")}
            />
          </div>
        </div>
      )}
    </>
  );
}
