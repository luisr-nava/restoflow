"use client";

import { useQuery } from "@tanstack/react-query";

import { getStaffAction } from "../actions/team.actions";

export function useGetStaff() {
  return useQuery({
    queryKey: ["team"],
    queryFn: getStaffAction,
  });
}
