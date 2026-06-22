"use client";

import { useQuery } from "@tanstack/react-query";

import { getOpenOrderByTableIdAction } from "../actions/order.actions";
import { orderKeys } from "../query-keys/order.keys";

export function useGetOpenOrderByTableId(tableId: string) {
  return useQuery({
    queryKey: orderKeys.open(tableId),
    queryFn: () => getOpenOrderByTableIdAction(tableId),
    enabled: Boolean(tableId),
  });
}
