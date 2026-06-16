"use client";

import { useQuery } from "@tanstack/react-query";

import { getOrderItemsAction } from "../actions/order.actions";

export function useGetOrderItems(orderId: string, open: boolean) {
  return useQuery({
    queryKey: ["order-items", orderId],
    queryFn: () => getOrderItemsAction(orderId),
    enabled: open && !!orderId,
  });
}
