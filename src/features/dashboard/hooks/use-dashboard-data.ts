import { useQuery } from "@tanstack/react-query";

import { getDashboardDataAction } from "../actions/dashboard.actions";
import { dashboardKeys } from "../query-keys/dashboard.keys";

export function useDashboardData() {
  return useQuery({
    queryKey: dashboardKeys.data,
    queryFn: getDashboardDataAction,
  });
}
