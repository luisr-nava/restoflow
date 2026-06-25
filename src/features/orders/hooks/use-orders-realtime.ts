"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

import { createClient } from "@/src/lib/supabase/client";
import { dashboardKeys } from "@/src/features/dashboard/query-keys/dashboard.keys";
import { tableKeys } from "@/src/features/tables/query-keys/table.keys";
import { orderKeys } from "../query-keys/order.keys";

type OrderItemRealtimePayload = RealtimePostgresChangesPayload<
  Record<string, unknown>
>;

export function useOrdersRealtime() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const supabase = createClient();

    function invalidateOrders() {
      queryClient.invalidateQueries({
        queryKey: orderKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: dashboardKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: tableKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: orderKeys.openRoot,
      });

      queryClient.invalidateQueries({
        queryKey: tableKeys.staffAll,
      });

      queryClient.invalidateQueries({
        queryKey: orderKeys.staffOpenRoot,
      });

      queryClient.invalidateQueries({
        queryKey: orderKeys.activeRoot,
      });

      queryClient.invalidateQueries({
        queryKey: orderKeys.staffAll,
      });
    }

    function invalidateOrderItems(payload: OrderItemRealtimePayload) {
      const orderIdFromNew =
        "order_id" in payload.new && typeof payload.new.order_id === "string"
          ? payload.new.order_id
          : null;
      const orderIdFromOld =
        "order_id" in payload.old && typeof payload.old.order_id === "string"
          ? payload.old.order_id
          : null;
      const orderId = orderIdFromNew ?? orderIdFromOld ?? null;

      if (orderId) {
        queryClient.invalidateQueries({
          queryKey: orderKeys.items(orderId),
        });
      }

      queryClient.invalidateQueries({
        queryKey: orderKeys.itemsRoot,
      });
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
        () => {
          invalidateOrders();
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
          invalidateOrderItems(payload);
          invalidateOrders();
        },
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "restaurant_tables",
        },
        () => {
          invalidateOrders();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}
