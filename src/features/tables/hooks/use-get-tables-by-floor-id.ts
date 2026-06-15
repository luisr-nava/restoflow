"use client";

import { useQuery } from "@tanstack/react-query";

import { getTablesByFloorIdAction } from "../actions/table.actions";

type UseGetTablesByFloorIdParams = {
  floorId: string | null;
};

export function useGetTablesByFloorId({
  floorId,
}: UseGetTablesByFloorIdParams) {
  return useQuery({
    queryKey: ["tables", floorId],
    queryFn: () => getTablesByFloorIdAction(floorId ?? ""),
    enabled: Boolean(floorId),
  });
}
