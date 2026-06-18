"use client";

import { OrderDetailsModal } from "./order-details-modal";
import { useGetOrders } from "../hooks/use-get-orders";
import { useOrdersRealtime } from "../hooks/use-orders-realtime";
import { useUpdateOrderStatus } from "../hooks/use-update-order-status";
import type { OrderStatus, OrderWithTable } from "../types/order.types";
import type { UpdateOrderStatusInput } from "../types/order.types";

const columns: {
  title: string;
  statuses: OrderStatus[];
}[] = [
  {
    title: "Pendientes",
    statuses: ["PENDING", "ACCEPTED"],
  },
  {
    title: "En preparación",
    statuses: ["PREPARING"],
  },
  {
    title: "Listos",
    statuses: ["READY"],
  },
];

const nextStatusByStatus: Partial<
  Record<OrderStatus, UpdateOrderStatusInput["status"]>
> = {
  PENDING: "ACCEPTED",
  ACCEPTED: "PREPARING",
  PREPARING: "READY",
};

const actionLabelByStatus: Partial<Record<OrderStatus, string>> = {
  PENDING: "Aceptar",
  ACCEPTED: "Preparar",
  PREPARING: "Marcar listo",
};

function KitchenOrderCard({ order }: { order: OrderWithTable }) {
  const { mutate, isPending } = useUpdateOrderStatus();

  const nextStatus = nextStatusByStatus[order.status];

  const actionLabel = actionLabelByStatus[order.status];

  return (
    <div className="rounded-2xl border border-border bg-background p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-medium">
            {order.restaurant_tables?.name ?? "Mesa sin nombre"}
          </h3>

          <p className="mt-1 font-mono text-xs text-muted-foreground">
            #{order.id.slice(0, 8)}
          </p>
        </div>

        <p className="font-mono text-sm font-medium">${order.total}</p>
      </div>

      <div className="mt-4 flex flex-wrap justify-end gap-2">
        <OrderDetailsModal orderId={order.id} />

        {nextStatus && actionLabel && (
          <button
            type="button"
            disabled={isPending}
            onClick={() => {
              mutate({
                orderId: order.id,
                status: nextStatus,
              });
            }}
            className="rounded-lg border border-border px-3 py-2 text-xs font-medium disabled:cursor-not-allowed disabled:opacity-40">
            {isPending ? "Actualizando..." : actionLabel}
          </button>
        )}
      </div>
    </div>
  );
}

export function KitchenView() {
  useOrdersRealtime();

  const { data: orders = [], isLoading } = useGetOrders();
  console.log("Kitchen orders:", orders);
  const activeOrders = orders.filter((order) =>
    ["PENDING", "ACCEPTED", "PREPARING", "READY"].includes(order.status),
  );

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Cocina
        </p>

        <h1 className="mt-1 text-2xl font-semibold">Pedidos en cocina</h1>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-border bg-background p-6 text-sm text-muted-foreground">
          Cargando...
        </div>
      ) : activeOrders.length === 0 ? (
        <div className="rounded-2xl border border-border bg-background p-6 text-sm text-muted-foreground">
          No hay pedidos activos.
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-3">
          {columns.map((column) => {
            const columnOrders = activeOrders.filter((order) =>
              column.statuses.includes(order.status),
            );

            return (
              <section
                key={column.title}
                className="rounded-2xl border border-border bg-muted/20 p-3">
                <div className="mb-3 flex items-center justify-between">
                  <h2 className="text-sm font-medium">{column.title}</h2>

                  <span className="font-mono text-xs text-muted-foreground">
                    {columnOrders.length}
                  </span>
                </div>

                <div className="space-y-3">
                  {columnOrders.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
                      Sin pedidos.
                    </div>
                  ) : (
                    columnOrders.map((order) => (
                      <KitchenOrderCard key={order.id} order={order} />
                    ))
                  )}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
