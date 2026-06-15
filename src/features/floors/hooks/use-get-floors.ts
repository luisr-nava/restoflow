"use client";

import { useQuery } from "@tanstack/react-query";

import { getFloorsAction } from "../actions/floor.actions";

export function useGetFloors() {
  return useQuery({
    queryKey: ["floors"],
    queryFn: () => getFloorsAction(),
  });
}
