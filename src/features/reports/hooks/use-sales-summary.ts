"use client";

import { useQuery } from "@tanstack/react-query";

import { getSalesSummaryAction } from "../actions/report.actions";

export function useSalesSummary() {
  return useQuery({
    queryKey: ["reports", "sales-summary"],
    queryFn: getSalesSummaryAction,
  });
}
