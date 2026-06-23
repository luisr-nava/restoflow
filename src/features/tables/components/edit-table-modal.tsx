"use client";

import { useUiModalStore } from "@/src/shared/stores/ui-modal.store";
import type { RestaurantTable } from "../types/table.types";
import { EditTableForm } from "./edit-table-form";

type EditTableModalProps = {
  table: RestaurantTable;
};

export function EditTableModal({ table }: EditTableModalProps) {
  const openModal = useUiModalStore((state) => state.openModal);
  const closeModal = useUiModalStore((state) => state.closeModal);
  const open = useUiModalStore(
    (state) =>
      state.modals.editTable?.open === true &&
      state.modals.editTable?.payload?.tableId === table.id,
  );

  return (
    <>
      <button
        type="button"
        onClick={() => openModal("editTable", { tableId: table.id })}
        className="rounded-lg border border-border px-3 py-2 text-xs font-medium text-foreground hover:bg-muted">
        Editar
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Editar mesa
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Modificá los datos de la mesa seleccionada.
                </p>
              </div>

              <button
                type="button"
                onClick={() => closeModal("editTable")}
                className="text-sm text-muted-foreground hover:text-foreground">
                Cerrar
              </button>
            </div>

            <EditTableForm
              table={table}
              onSuccess={() => closeModal("editTable")}
            />
          </div>
        </div>
      )}
    </>
  );
}
