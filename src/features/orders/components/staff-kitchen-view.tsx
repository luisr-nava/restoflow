"use client";

import { EmptyState, LoadingState } from "@/src/shared/components/states";
import {
  ageCardClassNameByLevel,
  getElapsedMinutes,
  getKitchenOrderAgeLevel,
  sourceLabelBySource,
  statusLabelByStatus,
} from "../lib/kitchen.helpers";
import { OrderDetailsModal } from "./order-details-modal";
import { useGetStaffOrders } from "../hooks/use-get-staff-orders";
import { useOrdersRealtime } from "../hooks/use-orders-realtime";
import { useUpdateStaffOrderStatus } from "../hooks/use-update-staff-order-status";
import type { OrderStatus, OrderWithTable } from "../types/order.types";
import type { UpdateOrderStatusInput } from "../types/order.types";

const columns: {
  title: string;
  description: string;
  statuses: OrderStatus[];
}[] = [
  {
    title: "Pendientes",
    description: "Pedidos por aceptar o iniciar",
    statuses: ["PENDING", "ACCEPTED"],
  },
  {
    title: "En preparación",
    description: "Pedidos que cocina está preparando",
    statuses: ["PREPARING"],
  },
  {
    title: "Listos",
    description: "Pedidos listos para entregar",
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

const statusClassNameByStatus: Record<OrderStatus, string> = {
  PENDING: "border-amber-200 text-amber-700",
  ACCEPTED: "border-sky-200 text-sky-700",
  PREPARING: "border-orange-200 text-orange-700",
  READY: "border-emerald-200 text-emerald-700",
  SERVED: "border-green-200 text-green-700",
  CANCELED: "border-red-200 text-red-700",
  PAID: "border-zinc-200 text-zinc-700",
};

function StaffKitchenOrderCard({ order }: { order: OrderWithTable }) {
  const { mutate, isPending } = useUpdateStaffOrderStatus();

  const nextStatus = nextStatusByStatus[order.status];
  const actionLabel = actionLabelByStatus[order.status];
  const statusLabel = statusLabelByStatus[order.status];
  const sourceLabel = sourceLabelBySource[order.source];
  const elapsedTimeLabel = getElapsedMinutes(order.created_at);
  const ageLevel = getKitchenOrderAgeLevel(order.created_at);

  return (
    <div
      className={`rounded-2xl border p-4 ${ageCardClassNameByLevel[ageLevel]}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-base font-semibold text-foreground">
            {order.restaurant_tables?.name ?? "Mesa sin nombre"}
          </h3>

          <p className="mt-1 font-mono text-xs text-muted-foreground">
            #{order.id.slice(0, 8)}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">{elapsedTimeLabel}</p>

          <div className="mt-3 flex flex-wrap gap-2">
            <span
              className={`rounded-full border px-2 py-1 font-mono text-[10px] uppercase ${statusClassNameByStatus[order.status]}`}>
              {statusLabel}
            </span>

            <span className="rounded-full border border-border px-2 py-1 font-mono text-[10px] uppercase text-muted-foreground">
              {sourceLabel}
            </span>
          </div>
        </div>

        <div className="text-right">
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            Total
          </p>
          <p className="mt-1 font-mono text-lg font-semibold text-foreground">
            ${order.total}
          </p>
        </div>
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

export function StaffKitchenView() {
  useOrdersRealtime();

  const { data: orders = [], isLoading } = useGetStaffOrders();

  const activeOrders = orders.filter((order) =>
    ["PENDING", "ACCEPTED", "PREPARING", "READY"].includes(order.status),
  );

  return (
    <div className="space-y-6">
      {isLoading ? (
        <LoadingState label="Cargando pedidos de cocina..." />
      ) : activeOrders.length === 0 ? (
        <EmptyState
          title="No hay pedidos pendientes para preparar"
          description="Cuando entren nuevos pedidos, aparecerán organizados por estado."
        />
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
                <div className="mb-3 rounded-xl border border-border/70 bg-background/70 p-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="text-sm font-semibold text-foreground">
                        {column.title}
                      </h2>

                      <p className="mt-1 text-xs text-muted-foreground">
                        {column.description}
                      </p>
                    </div>

                    <span className="rounded-full border border-border bg-background px-2.5 py-1 font-mono text-xs text-foreground">
                      {columnOrders.length}
                    </span>
                  </div>
                </div>

                <div className="space-y-3">
                  {columnOrders.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-border p-4 text-sm text-muted-foreground">
                      Sin pedidos.
                    </div>
                  ) : (
                    columnOrders.map((order) => (
                      <StaffKitchenOrderCard key={order.id} order={order} />
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
