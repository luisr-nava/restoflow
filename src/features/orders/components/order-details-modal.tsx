"use client";

import { AppDialog } from "@/src/shared/components/ui/AppDialog";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/src/shared/components/states";
import { useUiModalStore } from "@/src/shared/stores/ui-modal.store";
import { formatMoney } from "@/src/shared/utils/format-money";
import { useGetOrderItems } from "../hooks/use-get-order-items";

type OrderDetailsModalProps = {
  orderId: string;
  currency?: string | null;
};

export function OrderDetailsModal({
  orderId,
  currency,
}: OrderDetailsModalProps) {
  const openModal = useUiModalStore((state) => state.openModal);
  const closeModal = useUiModalStore((state) => state.closeModal);
  const open = useUiModalStore(
    (state) =>
      state.modals.orderDetails?.open === true &&
      state.modals.orderDetails?.payload?.orderId === orderId,
  );

  const { data: items = [], error, isError, isLoading } = useGetOrderItems(
    orderId,
    open,
  );

  return (
    <>
      <button
        type="button"
        onClick={() => openModal("orderDetails", { orderId })}
        className="rounded-lg border border-border px-3 py-2 text-xs font-medium">
        Ver detalle
      </button>

      <AppDialog
        open={open}
        onClose={() => closeModal("orderDetails")}
        title={
          <>
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Pedido
            </span>
            <span className="mt-1 block text-lg font-medium text-foreground">
              Detalle del pedido
            </span>
          </>
        }
        size="2xl">
        {isLoading ? (
          <LoadingState
            label="Cargando detalle del pedido..."
            className="rounded-none border-0 bg-transparent px-0 py-8 text-center"
          />
        ) : isError ? (
          <ErrorState
            title="No se pudo cargar el detalle del pedido"
            description={error.message}
            className="rounded-none border-0 bg-transparent px-0 py-8"
          />
        ) : items.length === 0 ? (
          <EmptyState
            title="Este pedido no tiene productos"
            description="Puede haber sido creado sin items o estar incompleto."
            className="rounded-none border-0 bg-transparent px-0 py-8"
          />
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between rounded-xl border border-border p-3">
                <div>
                  <h3 className="text-sm font-medium">{item.name}</h3>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {item.quantity} x {formatMoney(item.unit_price, currency)}
                  </p>
                </div>

                <p className="font-mono text-sm font-medium">
                  {formatMoney(item.total, currency)}
                </p>
              </div>
            ))}
          </div>
        )}
      </AppDialog>
    </>
  );
}
