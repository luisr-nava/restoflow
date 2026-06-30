"use client";

import { useReportsOverview } from "./use-reports-overview";

export function useTopCategories() {
  const query = useReportsOverview();

  return {
    ...query,
    data: query.data?.topCategories ?? [],
  };
}
