"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { createClient } from "@/src/lib/supabase/client";

export function useOrdersRealtime() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const supabase = createClient();

    function invalidateOrders() {
      console.log("orders realtime event received");
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
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

