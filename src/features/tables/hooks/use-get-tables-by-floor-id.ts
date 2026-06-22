"use client";

import { useQuery } from "@tanstack/react-query";

import { getTablesByFloorIdAction } from "../actions/table.actions";
import { tableKeys } from "../query-keys/table.keys";

type UseGetTablesByFloorIdParams = {
  floorId: string | null;
};

export function useGetTablesByFloorId({
  floorId,
}: UseGetTablesByFloorIdParams) {
  return useQuery({
    queryKey: tableKeys.byFloor(floorId),
    queryFn: () => getTablesByFloorIdAction(floorId ?? ""),
    enabled: Boolean(floorId),
  });
}
