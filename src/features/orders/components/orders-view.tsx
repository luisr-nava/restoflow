"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { useRestaurantSettingsContext } from "@/src/features/restaurants/hooks/use-restaurant-settings-context";
import { EmptyState, ErrorState } from "@/src/shared/components/states";
import { Card, CardContent } from "@/src/shared/components/ui/Card";
import { Skeleton } from "@/src/shared/components/ui/Skeleton";
import { formatMoney } from "@/src/shared/utils/format-money";
import { useGetOrders } from "../hooks/use-get-orders";
import type { OrderWithTableAndItems } from "../types/order.types";
import {
  formatOrderDateTime,
  OrderDetailsContent,
  OrderStatusBadge,
} from "./order-details-modal";

type OrderAccordionItemProps = {
  order: OrderWithTableAndItems;
  currency?: string | null;
  isExpanded: boolean;
  onToggle: (orderId: string) => void;
};

function formatOrderCode(orderId: string) {
  return `#${orderId.slice(0, 8)}`;
}

function OrderAccordionItem({
  order,
  currency,
  isExpanded,
  onToggle,
}: OrderAccordionItemProps) {
  const createdAtLabel = formatOrderDateTime(order.created_at);

  return (
    <Card
      as="article"
      variant="default"
      size="sm"
      className="overflow-hidden border-border/70 bg-white p-0">
      <button
        type="button"
        aria-expanded={isExpanded}
        aria-controls={`order-details-${order.id}`}
        className="w-full p-4 text-left transition hover:bg-surface/40"
        onClick={() => onToggle(order.id)}>
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-sm font-medium text-foreground">
                {order.restaurant_tables?.name ?? "Mesa sin nombre"}
              </h3>

              <span className="font-mono text-xs text-muted-foreground">
                {formatOrderCode(order.id)}
              </span>
            </div>

            {createdAtLabel ? (
              <p className="mt-2 text-xs text-muted-foreground">
                {createdAtLabel}
              </p>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-3 lg:justify-end">
            <OrderStatusBadge status={order.status} />

            <div className="text-left lg:text-right">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Total
              </p>
              <p className="mt-1 font-mono text-sm font-medium text-foreground">
                {formatMoney(order.total, currency)}
              </p>
            </div>

            <span className="inline-flex size-8 items-center justify-center rounded-full border border-border text-muted-foreground">
              <ChevronDown
                size={16}
                className={`transition-transform ${isExpanded ? "rotate-180" : ""}`}
              />
            </span>
          </div>
        </div>
      </button>

      {isExpanded ? (
        <div
          id={`order-details-${order.id}`}
          className="border-t border-border bg-background px-4 pb-4 pt-4">
          <OrderDetailsContent
            order={order}
            items={order.order_items}
            currency={currency}
            isLoading={false}
            isError={false}
          />
        </div>
      ) : null}
    </Card>
  );
}

export function OrdersView() {
  const { data: orders = [], error, isError, isLoading } = useGetOrders();
  const { restaurant } = useRestaurantSettingsContext();
  const currency = restaurant?.currency;
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const toggleOrder = (orderId: string) => {
    setExpandedOrderId((currentOrderId) =>
      currentOrderId === orderId ? null : orderId,
    );
  };

  return (
    <div className="space-y-6">
      {isLoading ? (
        <Card variant="default" size="lg" className="p-0">
          <CardContent className="grid gap-3 p-3">
            {Array.from({ length: 5 }).map((_, index) => (
              <Card key={index} size="sm" className="border-border/70 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-3 w-24" />
                  </div>

                  <div className="flex items-center gap-3">
                    <Skeleton className="h-6 w-24 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-12" />
                      <Skeleton className="h-4 w-16" />
                    </div>
                    <Skeleton className="size-8 rounded-full" />
                  </div>
                </div>
              </Card>
            ))}
          </CardContent>
        </Card>
      ) : isError ? (
        <ErrorState
          title="No se pudieron cargar los pedidos"
          description={error.message}
          className="bg-transparent"
        />
      ) : orders.length === 0 ? (
        <EmptyState
          title="Todavía no hay pedidos"
          description="Los pedidos tomados desde mesas o QR aparecerán acá."
          className="bg-transparent"
        />
      ) : (
        <div className="grid gap-3">
          {orders.map((order) => (
            <OrderAccordionItem
              key={order.id}
              order={order}
              currency={currency}
              isExpanded={expandedOrderId === order.id}
              onToggle={toggleOrder}
            />
          ))}
        </div>
      )}
    </div>
  );
}
