"use client";

import { useQuery } from "@tanstack/react-query";

import { getActiveOrderByTableIdAction } from "../actions/order.actions";
import { orderKeys } from "../query-keys/order.keys";

export function useGetActiveOrderByTableId(tableId: string) {
  return useQuery({
    queryKey: orderKeys.active(tableId),
    queryFn: () => getActiveOrderByTableIdAction(tableId),
    enabled: Boolean(tableId),
  });
}
