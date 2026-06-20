"use client";

import { useQuery } from "@tanstack/react-query";

import { getStaffOpenOrderByTableIdAction } from "../actions/order.actions";

export function useGetStaffOpenOrderByTableId(tableId: string) {
  return useQuery({
    queryKey: ["staff-open-order", tableId],
    queryFn: () => getStaffOpenOrderByTableIdAction(tableId),
    enabled: Boolean(tableId),
  });
}
