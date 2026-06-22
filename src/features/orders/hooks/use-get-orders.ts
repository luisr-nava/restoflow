"use client";

import { useQuery } from "@tanstack/react-query";

import { getOrdersAction } from "../actions/order.actions";
import { orderKeys } from "../query-keys/order.keys";

export function useGetOrders() {
  return useQuery({
    queryKey: orderKeys.all,
    queryFn: getOrdersAction,
  });
}
