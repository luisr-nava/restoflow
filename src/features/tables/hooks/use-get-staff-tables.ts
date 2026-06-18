"use client";

import { useQuery } from "@tanstack/react-query";

import { getTablesByRestaurantIdAction } from "../actions/table.actions";

export function useGetStaffTables() {
  return useQuery({
    queryKey: ["staff-tables"],
    queryFn: () => getTablesByRestaurantIdAction(),
  });
}
