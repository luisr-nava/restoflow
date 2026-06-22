"use client";

import { useQuery } from "@tanstack/react-query";

import { getOrderItemsAction } from "../actions/order.actions";
import { orderKeys } from "../query-keys/order.keys";

export function useGetOrderItems(orderId: string, open: boolean) {
  return useQuery({
    queryKey: orderKeys.items(orderId),
    queryFn: () => getOrderItemsAction(orderId),
    enabled: open && !!orderId,
  });
}
