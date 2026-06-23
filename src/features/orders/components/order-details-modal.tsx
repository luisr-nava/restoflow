"use client";

import { EmptyState, LoadingState } from "@/src/shared/components/states";
import { useUiModalStore } from "@/src/shared/stores/ui-modal.store";
import { useGetOrderItems } from "../hooks/use-get-order-items";

type OrderDetailsModalProps = {
  orderId: string;
};

export function OrderDetailsModal({ orderId }: OrderDetailsModalProps) {
  const openModal = useUiModalStore((state) => state.openModal);
  const closeModal = useUiModalStore((state) => state.closeModal);
  const open = useUiModalStore(
    (state) =>
      state.modals.orderDetails?.open === true &&
      state.modals.orderDetails?.payload?.orderId === orderId,
  );

  const { data: items = [], isLoading } = useGetOrderItems(orderId, open);

  return (
    <>
      <button
        type="button"
        onClick={() => openModal("orderDetails", { orderId })}
        className="rounded-lg border border-border px-3 py-2 text-xs font-medium">
        Ver detalle
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-2xl rounded-2xl border border-border bg-background p-6 shadow-lg">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Pedido
                </p>

                <h2 className="mt-1 text-lg font-medium">Detalle del pedido</h2>
              </div>

              <button
                type="button"
                onClick={() => closeModal("orderDetails")}
                className="rounded-lg border border-border px-3 py-2 text-xs">
                Cerrar
              </button>
            </div>

            {isLoading ? (
              <LoadingState
                label="Cargando detalle del pedido..."
                className="rounded-none border-0 bg-transparent px-0 py-8 text-center"
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
                        {item.quantity} x ${item.unit_price}
                      </p>
                    </div>

                    <p className="font-mono text-sm font-medium">
                      ${item.total}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
