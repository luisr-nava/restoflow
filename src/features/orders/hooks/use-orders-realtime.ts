"use client";

import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { createClient } from "@/src/lib/supabase/client";

export function useOrdersRealtime() {
  const queryClient = useQueryClient();

  useEffect(() => {
    const supabase = createClient();

    function invalidateOrders() {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });

      queryClient.invalidateQueries({
        queryKey: ["dashboard"],
      });

      queryClient.invalidateQueries({
        queryKey: ["tables"],
      });

      queryClient.invalidateQueries({
        queryKey: ["open-order"],
      });

      queryClient.invalidateQueries({
        queryKey: ["staff-tables"],
      });

      queryClient.invalidateQueries({
        queryKey: ["staff-open-order"],
      });

      queryClient.invalidateQueries({
        queryKey: ["active-order"],
      });

      queryClient.invalidateQueries({
        queryKey: ["staff-orders"],
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

