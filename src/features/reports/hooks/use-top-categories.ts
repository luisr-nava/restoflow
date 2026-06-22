"use client";

import { useQuery } from "@tanstack/react-query";

import { getTopCategoriesAction } from "../actions/report.actions";
import { reportKeys } from "../query-keys/report.keys";

export function useTopCategories() {
  return useQuery({
    queryKey: reportKeys.topCategories,
    queryFn: getTopCategoriesAction,
  });
}
