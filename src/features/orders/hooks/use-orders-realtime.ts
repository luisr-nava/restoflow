"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

import { createClient } from "@/src/lib/supabase/client";
import { tableKeys } from "@/src/features/tables/query-keys/table.keys";
import { orderKeys } from "../query-keys/order.keys";

type OrderItemRealtimeRow = {
  order_id: string | null;
};

export function useOrdersRealtime() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const supabase = createClient();

    function invalidateOrders() {
      queryClient.invalidateQueries({
        queryKey: orderKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
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

    function invalidateOrderItems(
      payload: RealtimePostgresChangesPayload<OrderItemRealtimeRow>,
    ) {
      const orderIdFromNew =
        "order_id" in payload.new ? payload.new.order_id : null;
      const orderIdFromOld =
        "order_id" in payload.old ? payload.old.order_id : null;
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
        (payload) => {
          console.log("REALTIME ORDERS:", payload);
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
          console.log("REALTIME ITEMS:", payload);
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
      .subscribe((status) => {
        console.log("REALTIME STATUS:", status);
      });

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
}
