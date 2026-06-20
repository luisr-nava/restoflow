"use client";

import { useQuery } from "@tanstack/react-query";

import { getTablesByRestaurantIdAction } from "../actions/table.actions";

export function useGetRestaurantTables() {
  return useQuery({
    queryKey: ["restaurant-tables"],
    queryFn: getTablesByRestaurantIdAction,
  });
}
