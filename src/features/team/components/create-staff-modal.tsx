"use client";

import { useUiModalStore } from "@/src/shared/stores/ui-modal.store";
import { CreateStaffForm } from "./create-staff-form";

export function CreateStaffModal() {
  const openModal = useUiModalStore((state) => state.openModal);
  const closeModal = useUiModalStore((state) => state.closeModal);
  const open = useUiModalStore((state) => state.modals.createStaff?.open ?? false);

  return (
    <>
      <button
        type="button"
        onClick={() => openModal("createStaff")}
        className="rounded-lg border border-border px-4 py-2 text-sm font-medium">
        Agregar personal
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-lg">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Equipo
                </p>

                <h2 className="mt-1 text-lg font-medium text-foreground">
                  Crear personal
                </h2>
              </div>

              <button
                type="button"
                onClick={() => closeModal("createStaff")}
                className="rounded-lg border border-border px-3 py-2 text-xs">
                Cerrar
              </button>
            </div>

            <CreateStaffForm onSuccess={() => closeModal("createStaff")} />
          </div>
        </div>
      )}
    </>
  );
}
