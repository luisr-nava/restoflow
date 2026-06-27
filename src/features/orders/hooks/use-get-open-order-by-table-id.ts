"use client";

import { useQuery } from "@tanstack/react-query";

import {
  getOpenOrderByTableIdAction,
  getOpenOrdersByTableIdsAction,
} from "../actions/order.actions";
import { orderKeys } from "../query-keys/order.keys";

export function useGetOpenOrderByTableId(tableId: string) {
  return useQuery({
    queryKey: orderKeys.open(tableId),
    queryFn: () => getOpenOrderByTableIdAction(tableId),
    enabled: Boolean(tableId),
  });
}

export function useGetOpenOrdersByTableIds(tableIds: string[]) {
  const normalizedTableIds = [...tableIds].sort();

  return useQuery({
    queryKey: orderKeys.openMany(normalizedTableIds),
    queryFn: () => getOpenOrdersByTableIdsAction(normalizedTableIds),
    enabled: normalizedTableIds.length > 0,
  });
}
