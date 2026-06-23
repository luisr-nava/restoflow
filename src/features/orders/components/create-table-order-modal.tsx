"use client";

import { useUiModalStore } from "@/src/shared/stores/ui-modal.store";
import { CreateTableOrderForm } from "./create-table-order-form";

type CreateTableOrderModalProps = {
  tableId: string;
  disabled?: boolean;
  mode?: "admin" | "staff";
};

export function CreateTableOrderModal({
  tableId,
  disabled = false,
  mode = "admin",
}: CreateTableOrderModalProps) {
  const openModal = useUiModalStore((state) => state.openModal);
  const closeModal = useUiModalStore((state) => state.closeModal);
  const open = useUiModalStore(
    (state) =>
      state.modals.createOrder?.open === true &&
      state.modals.createOrder?.payload?.tableId === tableId &&
      state.modals.createOrder?.payload?.mode === mode,
  );

  return (
    <>
      <button
        type="button"
        disabled={disabled}
        onClick={() => openModal("createOrder", { tableId, mode })}
        className="rounded-lg border border-border px-3 py-2 text-xs font-medium text-foreground disabled:cursor-not-allowed disabled:opacity-40">
        Tomar pedido
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-xl rounded-2xl border border-border bg-background p-6 shadow-lg">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Pedido
                </p>
                <h2 className="mt-1 text-lg font-medium text-foreground">
                  Tomar pedido
                </h2>
              </div>

              <button
                type="button"
                onClick={() => closeModal("createOrder")}
                className="rounded-lg border border-border px-3 py-2 text-xs">
                Cerrar
              </button>
            </div>

            <CreateTableOrderForm
              tableId={tableId}
              mode={mode}
              onSuccess={() => closeModal("createOrder")}
            />
          </div>
        </div>
      )}
    </>
  );
}


