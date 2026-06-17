"use client";

import { useQuery } from "@tanstack/react-query";

import { getFloorsAction } from "../actions/floor.actions";

type GetFloorsResponse = Awaited<ReturnType<typeof getFloorsAction>>;

export function useGetFloors() {
  return useQuery<GetFloorsResponse>({
    queryKey: ["floors"],
    queryFn: getFloorsAction,
  });
}
