"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { tableKeys } from "@/src/features/tables/query-keys/table.keys";
import { deleteFloorAction } from "../actions/floor.actions";
import { floorKeys } from "../query-keys/floor.keys";
import type { DeleteFloorInput, RestaurantFloor } from "../types/floor.types";

export function useDeleteFloor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: DeleteFloorInput) => {
      const result = await deleteFloorAction(input);

      if (result.error && !result.requiresConfirmation) {
        throw new Error(result.error);
      }

      return result;
    },
    onSuccess: (result, input) => {
      if (result.requiresConfirmation) {
        return;
      }

      queryClient.setQueryData<RestaurantFloor[]>(
        floorKeys.all,
        (currentFloors) =>
          currentFloors?.filter((floor) => floor.id !== input.floorId) ?? [],
      );

      queryClient.removeQueries({
        queryKey: tableKeys.byFloor(input.floorId),
      });

      queryClient.invalidateQueries({
        queryKey: floorKeys.all,
      });

      queryClient.invalidateQueries({
        queryKey: tableKeys.all,
      });

      toast.success(result.success);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
