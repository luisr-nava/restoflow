"use client";

import { useQuery } from "@tanstack/react-query";

import { getSalesSummaryAction } from "../actions/report.actions";
import { reportKeys } from "../query-keys/report.keys";

export function useSalesSummary() {
  return useQuery({
    queryKey: reportKeys.salesSummary,
    queryFn: getSalesSummaryAction,
  });
}
