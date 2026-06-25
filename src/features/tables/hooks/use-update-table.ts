"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { updateTableAction } from "../actions/table.actions";
import { tableKeys } from "../query-keys/table.keys";
import type { UpdateTableInput } from "../types/table.types";

type UpdateTableMutationInput = UpdateTableInput & {
  floorId: string;
};

export function useUpdateTable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateTableMutationInput) => {
      const result = await updateTableAction(input);

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
