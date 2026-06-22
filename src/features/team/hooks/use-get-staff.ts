"use client";

import { useQuery } from "@tanstack/react-query";

import { getStaffAction } from "../actions/team.actions";
import { teamKeys } from "../query-keys/team.keys";

export function useGetStaff() {
  return useQuery({
    queryKey: teamKeys.all,
    queryFn: getStaffAction,
  });
}
