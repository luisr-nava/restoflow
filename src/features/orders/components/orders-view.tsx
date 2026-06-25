"use client";

import { useGetRestaurantSettings } from "@/src/features/restaurants/hooks/use-get-restaurant-settings";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/src/shared/components/states";
import { formatMoney } from "@/src/shared/utils/format-money";
import { useGetOrders } from "../hooks/use-get-orders";
import type { OrderStatus } from "../types/order.types";
import { OrderDetailsModal } from "./order-details-modal";

const statusLabel: Record<OrderStatus, string> = {
  PENDING: "Pendiente",
  ACCEPTED: "Aceptado",
  PREPARING: "Preparando",
  READY: "Listo",
  SERVED: "Servido",
  CANCELED: "Cancelado",
  PAID: "Pagado",
};

export function OrdersView() {
  const { data: orders = [], error, isError, isLoading } = useGetOrders();
  const { data: restaurantSettings } = useGetRestaurantSettings();
  const currency = restaurantSettings?.data?.currency;

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Pedidos
        </p>

        <h1 className="mt-1 text-2xl font-semibold">Pedidos del restaurante</h1>
      </div>

      <div className="rounded-2xl border border-border bg-background">
        {isLoading ? (
          <LoadingState
            label="Cargando pedidos..."
            className="rounded-none border-0 bg-transparent"
          />
        ) : isError ? (
          <ErrorState
            title="No se pudieron cargar los pedidos"
            description={error.message}
            className="rounded-none border-0 bg-transparent"
          />
        ) : orders.length === 0 ? (
          <EmptyState
            title="Todavía no hay pedidos"
            description="Los pedidos tomados desde mesas o QR aparecerán acá."
            className="rounded-none border-0 bg-transparent"
          />
        ) : (
          <div className="divide-y divide-border">
            {orders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between gap-4 p-4">
                <div>
                  <h3 className="text-sm font-medium">
                    {order.restaurant_tables?.name ?? "Mesa sin nombre"}
                  </h3>

                  <p className="mt-1 font-mono text-xs text-muted-foreground">
                    #{order.id.slice(0, 8)}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="rounded-full border border-border px-2 py-1 font-mono text-[10px] uppercase">
                    {statusLabel[order.status]}
                  </span>

                  <p className="font-mono text-sm font-medium">
                    {formatMoney(order.total, currency)}
                  </p>

                  <OrderDetailsModal orderId={order.id} currency={currency} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
