"use client";

import { useQuery } from "@tanstack/react-query";

import { getStaffOrdersAction } from "../actions/order.actions";
import { orderKeys } from "../query-keys/order.keys";

export function useGetStaffOrders() {
  return useQuery({
    queryKey: orderKeys.staffAll,
    queryFn: getStaffOrdersAction,
  });
}
