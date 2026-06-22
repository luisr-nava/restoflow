"use client";

import { useQuery } from "@tanstack/react-query";

import { getTablesByStaffSessionAction } from "../actions/table.actions";
import { tableKeys } from "../query-keys/table.keys";

export function useGetStaffTables() {
  return useQuery({
    queryKey: tableKeys.staffAll,
    queryFn: () => getTablesByStaffSessionAction(),
  });
}

