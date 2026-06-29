"use client";

import { useGetRestaurantSettings } from "@/src/features/restaurants/hooks/use-get-restaurant-settings";
import {
  EmptyState,
  ErrorState,
} from "@/src/shared/components/states";
import { Card, CardContent } from "@/src/shared/components/ui/Card";
import { Skeleton } from "@/src/shared/components/ui/Skeleton";
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
      <Card variant="default" size="lg" className="p-0">
        {isLoading ? (
          <CardContent className="divide-y divide-border">
            {Array.from({ length: 5 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-4 p-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-3 w-20" />
                </div>
                <div className="flex items-center gap-3">
                  <Skeleton className="h-6 w-20 rounded-full" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-8 w-24 rounded-lg" />
                </div>
              </div>
            ))}
          </CardContent>
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
          <CardContent className="divide-y divide-border">
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
          </CardContent>
        )}
      </Card>
    </div>
  );
}
