"use client";

import { useQuery } from "@tanstack/react-query";

import { getStaffOpenOrderByTableIdAction } from "../actions/order.actions";
import { orderKeys } from "../query-keys/order.keys";

export function useGetStaffOpenOrderByTableId(tableId: string) {
  return useQuery({
    queryKey: orderKeys.staffOpen(tableId),
    queryFn: () => getStaffOpenOrderByTableIdAction(tableId),
    enabled: Boolean(tableId),
  });
}
