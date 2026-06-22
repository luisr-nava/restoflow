"use client";

import { useQuery } from "@tanstack/react-query";

import { getTopProductsAction } from "../actions/report.actions";
import { reportKeys } from "../query-keys/report.keys";

export function useTopProducts() {
  return useQuery({
    queryKey: reportKeys.topProducts,
    queryFn: getTopProductsAction,
  });
}
