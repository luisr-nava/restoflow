"use client";

import { useReportsOverview } from "./use-reports-overview";

export function useSalesSummary() {
  const query = useReportsOverview();

  return {
    ...query,
    data: query.data?.salesSummary,
  };
}
