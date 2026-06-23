"use client";

import { useUiModalStore } from "@/src/shared/stores/ui-modal.store";
import { CreateFloorForm } from "./create-floor-form";

type CreateFloorModalProps = {
  openText?: string;
};

export function CreateFloorModal({
  openText = "Crear piso",
}: CreateFloorModalProps) {
  const openModal = useUiModalStore((state) => state.openModal);
  const closeModal = useUiModalStore((state) => state.closeModal);
  const open = useUiModalStore((state) => state.modals.createFloor?.open ?? false);

  return (
    <>
      <button
        type="button"
        onClick={() => openModal("createFloor")}
        className="rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-muted">
        {openText}
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-xl">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  Crear piso
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Agregá un nuevo sector para organizar las mesas.
                </p>
              </div>

              <button
                type="button"
                onClick={() => closeModal("createFloor")}
                className="text-sm text-muted-foreground hover:text-foreground">
                Cerrar
              </button>
            </div>

            <CreateFloorForm onSuccess={() => closeModal("createFloor")} />
          </div>
        </div>
      )}
    </>
  );
}
