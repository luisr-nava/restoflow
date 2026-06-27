"use client";

import { useQuery } from "@tanstack/react-query";

import {
  getStaffOpenOrderByTableIdAction,
  getStaffOpenOrdersByTableIdsAction,
} from "../actions/order.actions";
import { orderKeys } from "../query-keys/order.keys";

export function useGetStaffOpenOrderByTableId(tableId: string) {
  return useQuery({
    queryKey: orderKeys.staffOpen(tableId),
    queryFn: () => getStaffOpenOrderByTableIdAction(tableId),
    enabled: Boolean(tableId),
  });
}

export function useGetStaffOpenOrdersByTableIds(tableIds: string[]) {
  const normalizedTableIds = [...tableIds].sort();

  return useQuery({
    queryKey: orderKeys.staffOpenMany(normalizedTableIds),
    queryFn: () => getStaffOpenOrdersByTableIdsAction(normalizedTableIds),
    enabled: normalizedTableIds.length > 0,
  });
}
