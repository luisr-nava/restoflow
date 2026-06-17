"use client";

import { useQuery } from "@tanstack/react-query";

import { getTopProductsAction } from "../actions/report.actions";

export function useTopProducts() {
  return useQuery({
    queryKey: ["reports", "top-products"],
    queryFn: getTopProductsAction,
  });
}
