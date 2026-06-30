"use client";

import type { ReactNode } from "react";
import { AppDialog } from "@/src/shared/components/ui/AppDialog";
import { Button } from "@/src/shared/components/ui/Button";
import { Card } from "@/src/shared/components/ui/Card";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/src/shared/components/states";
import { useUiModalStore } from "@/src/shared/stores/ui-modal.store";
import { formatMoney } from "@/src/shared/utils/format-money";
import { useGetOrderItems } from "../hooks/use-get-order-items";
import type {
  OrderItemDetail,
  OrderStatus,
  OrderWithTable,
} from "../types/order.types";

type OrderDetailsModalProps = {
  orderId: string;
  currency?: string | null;
  order?: OrderWithTable;
};

type OrderStatusBadgeProps = {
  status: OrderStatus;
};

type OrderDetailsContentProps = {
  order?: OrderWithTable;
  items: OrderItemDetail[];
  currency?: string | null;
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
};

type DetailFieldProps = {
  label: string;
  value: ReactNode;
};

export const orderStatusLabelByStatus: Record<OrderStatus, string> = {
  PENDING: "Pendiente",
  ACCEPTED: "Aceptado",
  PREPARING: "Preparando",
  READY: "Listo",
  SERVED: "Servido",
  CANCELED: "Cancelado",
  PAID: "Pagado",
};

const orderStatusClassNameByStatus: Record<OrderStatus, string> = {
  PENDING: "border-warn bg-warn-soft text-text",
  ACCEPTED: "border-sky-200 bg-sky-50 text-sky-700",
  PREPARING: "border-accent bg-accent-soft text-accent-ink",
  READY: "border-ok bg-ok-soft text-ok",
  SERVED: "border-border bg-surface text-muted-foreground",
  PAID: "border-green-200 bg-green-50 text-green-700",
  CANCELED: "border-danger bg-danger-soft text-danger",
};

export function formatOrderDateTime(value?: string | null) {
  if (!value) {
    return null;
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

function formatOrderCode(orderId: string) {
  return `#${orderId.slice(0, 8)}`;
}

function DetailField({ label, value }: DetailFieldProps) {
  return (
    <div>
      <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
        {label}
      </p>
      <div className="mt-1 text-sm text-foreground">{value}</div>
    </div>
  );
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return (
    <span
      className={`inline-flex rounded-full border px-2 py-1 font-mono text-[10px] uppercase ${orderStatusClassNameByStatus[status]}`}>
      {orderStatusLabelByStatus[status]}
    </span>
  );
}

export function OrderDetailsContent({
  order,
  items,
  currency,
  isLoading,
  isError,
  errorMessage,
}: OrderDetailsContentProps) {
  const createdAtLabel = formatOrderDateTime(order?.created_at);
  const orderNotes = order?.notes?.trim();

  return (
    <div className="space-y-4">
      {order ? (
        <>
          <div className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_220px]">
            <Card variant="muted" size="sm" className="bg-surface/60">
              <div className="grid gap-3 sm:grid-cols-2">
                <DetailField
                  label="Mesa"
                  value={order.restaurant_tables?.name ?? "Mesa sin nombre"}
                />

                <DetailField
                  label="Pedido"
                  value={
                    <span className="font-mono text-sm text-foreground">
                      {formatOrderCode(order.id)}
                    </span>
                  }
                />

                <DetailField
                  label="Estado"
                  value={<OrderStatusBadge status={order.status} />}
                />

                <DetailField label="Fecha" value={createdAtLabel ?? "-"} />

                <DetailField
                  label="Origen"
                  value={
                    <span className="font-mono text-xs uppercase text-foreground">
                      {order.source}
                    </span>
                  }
                />
              </div>
            </Card>

            <Card size="sm" className="flex flex-col justify-between">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Total general
              </p>
              <p className="mt-2 font-mono text-xl font-semibold text-foreground">
                {formatMoney(order.total, currency)}
              </p>
            </Card>
          </div>

          {orderNotes ? (
            <Card variant="muted" size="sm" className="bg-surface/60">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Notas
              </p>
              <p className="mt-2 text-sm text-foreground">{orderNotes}</p>
            </Card>
          ) : null}
        </>
      ) : null}

      <div className="overflow-hidden rounded-xl border border-border">
        <div className="hidden grid-cols-[minmax(0,1fr)_88px_140px_140px] gap-3 bg-surface/60 px-4 py-3 font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground md:grid">
          <span>Item</span>
          <span className="text-center">Cantidad</span>
          <span className="text-right">Unitario</span>
          <span className="text-right">Total</span>
        </div>

        {isLoading ? (
          <LoadingState
            label="Cargando detalle del pedido..."
            className="rounded-none border-0 bg-transparent px-4 py-8 text-center"
          />
        ) : isError ? (
          <ErrorState
            title="No se pudo cargar el detalle del pedido"
            description={errorMessage}
            className="rounded-none border-0 bg-transparent px-4 py-8"
          />
        ) : items.length === 0 ? (
          <EmptyState
            title="Este pedido no tiene productos"
            description="Puede haber sido creado sin items o estar incompleto."
            className="rounded-none border-0 bg-transparent px-4 py-8"
          />
        ) : (
          items.map((item) => (
            <div
              key={item.id}
              className="border-t border-border px-4 py-3 first:border-t-0 md:first:border-t">
              <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_88px_140px_140px] md:items-center">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-foreground">
                    {item.name}
                  </p>

                  {item.notes?.trim() ? (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Nota: {item.notes.trim()}
                    </p>
                  ) : null}
                </div>

                <div className="md:text-center">
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground md:hidden">
                    Cantidad
                  </p>
                  <p className="font-mono text-sm text-foreground">
                    {item.quantity}
                  </p>
                </div>

                <div className="md:text-right">
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground md:hidden">
                    Unitario
                  </p>
                  <p className="font-mono text-sm text-foreground">
                    {formatMoney(item.unit_price, currency)}
                  </p>
                </div>

                <div className="md:text-right">
                  <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground md:hidden">
                    Total
                  </p>
                  <p className="font-mono text-sm font-medium text-foreground">
                    {formatMoney(item.total, currency)}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export function OrderDetailsModal({
  orderId,
  currency,
  order,
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
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => openModal("orderDetails", { orderId })}>
        Ver detalle
      </Button>

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
        <OrderDetailsContent
          order={order}
          items={items}
          currency={currency}
          isLoading={isLoading}
          isError={isError}
          errorMessage={error?.message}
        />
      </AppDialog>
    </>
  );
}
