"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";
import { createClient } from "@/src/lib/supabase/client";
import { dashboardKeys } from "@/src/features/dashboard/query-keys/dashboard.keys";
import { tableKeys } from "@/src/features/tables/query-keys/table.keys";
import { orderKeys } from "../query-keys/order.keys";

const REALTIME_INVALIDATION_DELAY_MS = 120;

type OrderItemRealtimePayload = RealtimePostgresChangesPayload<
  Record<string, unknown>
>;
type OrderRealtimePayload = RealtimePostgresChangesPayload<
  Record<string, unknown>
>;
type RestaurantTableRealtimePayload = RealtimePostgresChangesPayload<
  Record<string, unknown>
>;

function getStringValue(
  record: Record<string, unknown> | Partial<Record<string, unknown>>,
  field: string,
) {
  const value = record[field];

  return typeof value === "string" ? value : null;
}

function getStringField(
  payload: RealtimePostgresChangesPayload<Record<string, unknown>>,
  field: string,
) {
  return (
    getStringValue(payload.new, field) ?? getStringValue(payload.old, field)
  );
}

export function useOrdersRealtime() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const supabase = createClient();
    const pendingInvalidations = new Map<string, readonly unknown[]>();
    let invalidateTimer: ReturnType<typeof setTimeout> | null = null;
    let isDisposed = false;

    function enqueueInvalidation(queryKey: readonly unknown[]) {
      pendingInvalidations.set(JSON.stringify(queryKey), queryKey);

      if (invalidateTimer !== null) {
        return;
      }

      invalidateTimer = setTimeout(() => {
        invalidateTimer = null;

        if (isDisposed || pendingInvalidations.size === 0) {
          pendingInvalidations.clear();
          return;
        }

        const queuedQueryKeys = [...pendingInvalidations.values()];
        pendingInvalidations.clear();

        void Promise.all(
          queuedQueryKeys.map((queuedQueryKey) =>
            queryClient.invalidateQueries({
              queryKey: queuedQueryKey,
            }),
          ),
        );
      }, REALTIME_INVALIDATION_DELAY_MS);
    }

    function enqueueOrderLists() {
      enqueueInvalidation(orderKeys.all);
      enqueueInvalidation(orderKeys.staffAll);
      enqueueInvalidation(dashboardKeys.all);
    }

    function enqueueTableOrderQueries(tableId: string | null) {
      if (!tableId) {
        enqueueInvalidation(orderKeys.openRoot);
        enqueueInvalidation(orderKeys.staffOpenRoot);
        enqueueInvalidation(orderKeys.activeRoot);
        return;
      }

      enqueueInvalidation(orderKeys.open(tableId));
      enqueueInvalidation(orderKeys.staffOpen(tableId));
      enqueueInvalidation(orderKeys.active(tableId));
    }

    function enqueueOrderInvalidations(payload: OrderRealtimePayload) {
      const orderId = getStringField(payload, "id");
      const tableId = getStringField(payload, "table_id");

      enqueueOrderLists();
      enqueueTableOrderQueries(tableId);

      if (orderId) {
        enqueueInvalidation(orderKeys.items(orderId));
      } else {
        enqueueInvalidation(orderKeys.itemsRoot);
      }
    }

    function enqueueOrderItemInvalidations(payload: OrderItemRealtimePayload) {
      const orderId = getStringField(payload, "order_id");

      if (orderId) {
        enqueueInvalidation(orderKeys.items(orderId));
      } else {
        enqueueInvalidation(orderKeys.itemsRoot);
      }

      enqueueOrderLists();
      enqueueInvalidation(orderKeys.openRoot);
      enqueueInvalidation(orderKeys.staffOpenRoot);
      enqueueInvalidation(orderKeys.activeRoot);
    }

    function enqueueTableInvalidations(
      payload: RestaurantTableRealtimePayload,
    ) {
      const tableId = getStringField(payload, "id");
      const floorId = getStringField(payload, "floor_id");

      enqueueInvalidation(dashboardKeys.all);
      enqueueInvalidation(tableKeys.staffAll);
      enqueueInvalidation(tableKeys.restaurantAll);
      if (floorId) {
        enqueueInvalidation(tableKeys.byFloor(floorId));
      } else {
        enqueueInvalidation(tableKeys.all);
      }

      enqueueTableOrderQueries(tableId);
    }

    const channel = supabase
      .channel("orders-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
        },
        (payload) => {
          enqueueOrderInvalidations(payload);
        },
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "order_items",
        },
        (payload) => {
          enqueueOrderItemInvalidations(payload);
        },
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "restaurant_tables",
        },
        (payload) => {
          enqueueTableInvalidations(payload);
        },
      )
      .subscribe();

    return () => {
      isDisposed = true;

      if (invalidateTimer !== null) {
        clearTimeout(invalidateTimer);
      }

      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}
