"use client";

import { useQuery } from "@tanstack/react-query";

import { getOrdersAction } from "../actions/order.actions";

export function useGetOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: getOrdersAction,
  });
}
