"use client";

import { useQuery } from "@tanstack/react-query";

import { getTablesByRestaurantIdAction } from "../actions/table.actions";
import { tableKeys } from "../query-keys/table.keys";

export function useGetRestaurantTables() {
  return useQuery({
    queryKey: tableKeys.restaurantAll,
    queryFn: getTablesByRestaurantIdAction,
  });
}
