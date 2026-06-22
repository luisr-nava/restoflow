"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { updateTableAction } from "../actions/table.actions";
import { tableKeys } from "../query-keys/table.keys";
import type { UpdateTableInput } from "../types/table.types";

export function useUpdateTable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateTableInput) => {
      const result = await updateTableAction(input);

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
