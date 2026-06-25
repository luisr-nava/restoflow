"use client";

import { OrderDetailsModal } from "./order-details-modal";
import { formatMoney } from "@/src/shared/utils/format-money";
import {
  ageCardClassNameByLevel,
  getElapsedMinutes,
  getKitchenOrderAgeLevel,
  kitchenActionLabelByStatus,
  kitchenColumns,
  kitchenNextStatusByStatus,
  kitchenStatusClassNameByStatus,
  sourceLabelBySource,
  statusLabelByStatus,
} from "../lib/kitchen.helpers";
import type { OrderWithTable, UpdateOrderStatusInput } from "../types/order.types";

type KitchenOrderCardProps = {
  order: OrderWithTable;
  currency?: string | null;
  isPending: boolean;
  onAdvanceStatus: (input: UpdateOrderStatusInput) => void;
};

function KitchenOrderCard({
  order,
  currency,
  isPending,
  onAdvanceStatus,
}: KitchenOrderCardProps) {
  const nextStatus = kitchenNextStatusByStatus[order.status];
  const actionLabel = kitchenActionLabelByStatus[order.status];
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
              className={`rounded-full border px-2 py-1 font-mono text-[10px] uppercase ${kitchenStatusClassNameByStatus[order.status]}`}>
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
            {formatMoney(order.total, currency)}
          </p>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap justify-end gap-2">
        <OrderDetailsModal orderId={order.id} currency={currency} />

        {nextStatus && actionLabel && (
          <button
            type="button"
            disabled={isPending}
            onClick={() => {
              onAdvanceStatus({
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

type KitchenOrderBoardProps = {
  orders: OrderWithTable[];
  currency?: string | null;
  isPending: boolean;
  onAdvanceStatus: (input: UpdateOrderStatusInput) => void;
};

export function KitchenOrderBoard({
  orders,
  currency,
  isPending,
  onAdvanceStatus,
}: KitchenOrderBoardProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {kitchenColumns.map((column) => {
        const columnOrders = orders.filter((order) =>
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
                  <KitchenOrderCard
                    key={order.id}
                    order={order}
                    currency={currency}
                    isPending={isPending}
                    onAdvanceStatus={onAdvanceStatus}
                  />
                ))
              )}
            </div>
          </section>
        );
      })}
    </div>
  );
}
