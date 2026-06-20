"use client";

import { useQuery } from "@tanstack/react-query";

import { getStaffOrdersAction } from "../actions/order.actions";

export function useGetStaffOrders() {
  return useQuery({
    queryKey: ["staff-orders"],
    queryFn: getStaffOrdersAction,
  });
}

