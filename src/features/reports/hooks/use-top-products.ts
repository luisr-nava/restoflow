"use client";

import { useReportsOverview } from "./use-reports-overview";

export function useTopProducts() {
  const query = useReportsOverview();

  return {
    ...query,
    data: query.data?.topProducts ?? [],
  };
}
