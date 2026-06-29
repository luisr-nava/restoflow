"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { updateTableReservationStatusAction } from "../actions/table.actions";
import { tableKeys } from "../query-keys/table.keys";
import type { UpdateTableReservationStatusInput } from "../types/table.types";

type UpdateTableReservationStatusMutationInput =
  UpdateTableReservationStatusInput & {
    floorId: string;
  };

export function useUpdateTableReservationStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateTableReservationStatusMutationInput) => {
      const result = await updateTableReservationStatusAction(input);

      if (result.error) {
        throw new Error(result.error);
      }

      return result;
    },
    onSuccess: async (result, input) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: tableKeys.all,
        }),
        queryClient.invalidateQueries({
          queryKey: tableKeys.staffAll,
        }),
        queryClient.invalidateQueries({
          queryKey: tableKeys.restaurantAll,
        }),
        queryClient.invalidateQueries({
          queryKey: tableKeys.byFloor(input.floorId),
        }),
      ]);

      toast.success(result.success);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
