"use client";

import { useGetStaffRestaurantCurrency } from "@/src/features/restaurants/hooks/use-get-staff-restaurant-currency";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/src/shared/components/states";
import {
  isKitchenActiveStatus,
} from "../lib/kitchen.helpers";
import { useGetStaffOrders } from "../hooks/use-get-staff-orders";
import { useOrdersRealtime } from "../hooks/use-orders-realtime";
import { useUpdateStaffOrderStatus } from "../hooks/use-update-staff-order-status";
import { KitchenOrderBoard } from "./kitchen-order-board";

export function StaffKitchenView() {
  useOrdersRealtime();

  const { data: orders = [], error, isError, isLoading } = useGetStaffOrders();
  const { data: staffRestaurantCurrency } = useGetStaffRestaurantCurrency();
  const { mutate, isPending } = useUpdateStaffOrderStatus();
  const currency = staffRestaurantCurrency?.data?.currency;

  const activeOrders = orders.filter((order) => isKitchenActiveStatus(order.status));

  return (
    <div className="space-y-6">
      {isLoading ? (
        <LoadingState label="Cargando pedidos de cocina..." />
      ) : isError ? (
        <ErrorState
          title="No se pudieron cargar los pedidos de cocina"
          description={error.message}
        />
      ) : activeOrders.length === 0 ? (
        <EmptyState
          title="No hay pedidos pendientes para preparar"
          description="Cuando entren nuevos pedidos, aparecerán organizados por estado."
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
