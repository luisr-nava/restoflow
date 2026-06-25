"use client";

import { useGetRestaurantSettings } from "@/src/features/restaurants/hooks/use-get-restaurant-settings";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/src/shared/components/states";
import {
  isKitchenActiveStatus,
} from "../lib/kitchen.helpers";
import { useGetOrders } from "../hooks/use-get-orders";
import { useOrdersRealtime } from "../hooks/use-orders-realtime";
import { useUpdateOrderStatus } from "../hooks/use-update-order-status";
import { KitchenOrderBoard } from "./kitchen-order-board";

export function KitchenView() {
  useOrdersRealtime();

  const { data: orders = [], error, isError, isLoading } = useGetOrders();
  const { data: restaurantSettings } = useGetRestaurantSettings();
  const { mutate, isPending } = useUpdateOrderStatus();
  const currency = restaurantSettings?.data?.currency;
  const activeOrders = orders.filter((order) => isKitchenActiveStatus(order.status));

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Cocina
        </p>

        <h1 className="mt-1 text-2xl font-semibold">Pedidos en cocina</h1>
      </div>

      {isLoading ? (
        <LoadingState label="Cargando pedidos de cocina..." />
      ) : isError ? (
        <ErrorState
          title="No se pudieron cargar los pedidos de cocina"
          description={error.message}
        />
      ) : activeOrders.length === 0 ? (
        <EmptyState
          title="No hay pedidos activos en cocina"
          description="Los pedidos pendientes, en preparación o listos aparecerán acá."
        />
      ) : (
        <KitchenOrderBoard
          orders={activeOrders}
          currency={currency}
          isPending={isPending}
          onAdvanceStatus={mutate}
        />
      )}
    </div>
  );
}
