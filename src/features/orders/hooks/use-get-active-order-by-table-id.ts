"use client";

import { useQuery } from "@tanstack/react-query";

import { getActiveOrderByTableIdAction } from "../actions/order.actions";

export function useGetActiveOrderByTableId(tableId: string) {
  return useQuery({
    queryKey: ["orders", "active", tableId],
    queryFn: () => getActiveOrderByTableIdAction(tableId),
    enabled: Boolean(tableId),
  });
}
