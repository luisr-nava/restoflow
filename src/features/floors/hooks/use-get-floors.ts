"use client";

import { useQuery } from "@tanstack/react-query";

import { getFloorsAction } from "../actions/floor.actions";
import { floorKeys } from "../query-keys/floor.keys";

type GetFloorsResponse = Awaited<ReturnType<typeof getFloorsAction>>;

export function useGetFloors() {
  return useQuery<GetFloorsResponse>({
    queryKey: floorKeys.all,
    queryFn: getFloorsAction,
  });
}
