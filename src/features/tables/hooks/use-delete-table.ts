"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { deleteTableAction } from "../actions/table.actions";
import { tableKeys } from "../query-keys/table.keys";

type DeleteTableMutationInput = {
  tableId: string;
  floorId: string;
};

export function useDeleteTable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: DeleteTableMutationInput) => {
      const result = await deleteTableAction(input.tableId);

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
