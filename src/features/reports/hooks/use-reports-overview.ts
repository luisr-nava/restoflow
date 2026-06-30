"use client";

import { useQuery } from "@tanstack/react-query";
import { getReportsOverviewAction } from "../actions/report.actions";
import { reportKeys } from "../query-keys/report.keys";

export function useReportsOverview() {
  return useQuery({
    queryKey: reportKeys.all,
    queryFn: getReportsOverviewAction,
  });
}
