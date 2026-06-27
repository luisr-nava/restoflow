"use client";

import { AppDialog } from "@/src/shared/components/ui/AppDialog";
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

      <AppDialog
        open={open}
        onClose={() => closeModal("createOrder")}
        title={
          <>
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Pedido
            </span>
            <span className="mt-1 block text-lg font-medium text-foreground">
              Tomar pedido
            </span>
          </>
        }
        size="xl">
        {open ? (
          <CreateTableOrderForm
            tableId={tableId}
            mode={mode}
            onSuccess={() => closeModal("createOrder")}
          />
        ) : null}
      </AppDialog>
    </>
  );
}
