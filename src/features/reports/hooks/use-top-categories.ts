"use client";

import { useQuery } from "@tanstack/react-query";

import { getTopCategoriesAction } from "../actions/report.actions";

export function useTopCategories() {
  return useQuery({
    queryKey: ["reports", "top-categories"],
    queryFn: getTopCategoriesAction,
  });
}
