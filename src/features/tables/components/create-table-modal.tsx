"use client";

import { useUiModalStore } from "@/src/shared/stores/ui-modal.store";
import { CreateTableForm } from "./create-table-form";

type CreateTableModalProps = {
  floorId: string;
  openText?: string;
};

export function CreateTableModal({
  floorId,
  openText = "Crear mesa",
}: CreateTableModalProps) {
  const openModal = useUiModalStore((state) => state.openModal);
  const closeModal = useUiModalStore((state) => state.closeModal);
  const open = useUiModalStore(
    (state) =>
      state.modals.createTable?.open === true &&
      state.modals.createTable?.payload?.floorId === floorId,
  );

  return (
    <>
      <button
        type="button"
        onClick={() => openModal("createTable", { floorId })}
        className="rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-muted">
        {openText}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">Crear mesa</h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Agregá una nueva mesa al piso seleccionado.
                </p>
              </div>

              <button
                type="button"
                onClick={() => closeModal("createTable")}
                className="text-sm text-muted-foreground hover:text-foreground">
                Cerrar
              </button>
            </div>

            <CreateTableForm
              floorId={floorId}
              onSuccess={() => closeModal("createTable")}
            />
          </div>
        </div>
      )}
    </>
  );
}
