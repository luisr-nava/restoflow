"use client";

import { useQuery } from "@tanstack/react-query";

import { getOpenOrderByTableIdAction } from "../actions/order.actions";

export function useGetOpenOrderByTableId(tableId: string) {
  return useQuery({
    queryKey: ["open-order", tableId],
    queryFn: () => getOpenOrderByTableIdAction(tableId),
    enabled: Boolean(tableId),
  });
}
