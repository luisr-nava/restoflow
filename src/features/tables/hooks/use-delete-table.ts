"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { deleteTableAction } from "../actions/table.actions";
import { tableKeys } from "../query-keys/table.keys";

export function useDeleteTable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tableId: string) => {
      const result = await deleteTableAction(tableId);

      if (result.error) {
        throw new Error(result.error);
      }

      return result;
    },
    onSuccess: async (result) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: tableKeys.all,
        }),
        queryClient.invalidateQueries({
          queryKey: tableKeys.restaurantAll,
        }),
      ]);

      toast.success(result.success);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
