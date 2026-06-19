"use client";

import { useQuery } from "@tanstack/react-query";

import { getTablesByStaffSessionAction } from "../actions/table.actions";
export function useGetStaffTables() {
  return useQuery({
    queryKey: ["staff-tables"],
    queryFn: () => getTablesByStaffSessionAction(),
  });
}


