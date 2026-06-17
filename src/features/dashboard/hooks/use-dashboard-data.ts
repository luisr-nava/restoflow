import { useQuery } from "@tanstack/react-query";

import { getDashboardDataAction } from "../actions/dashboard.actions";

export function useDashboardData() {
  return useQuery({
    queryKey: ["dashboard", "data"],
    queryFn: getDashboardDataAction,
  });
}
