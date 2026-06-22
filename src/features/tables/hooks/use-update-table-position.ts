"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { updateTablePositionAction } from "../actions/table.actions";
import { tableKeys } from "../query-keys/table.keys";
import type { UpdateTablePositionInput } from "../types/table.types";

export function useUpdateTablePosition() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateTablePositionInput) => {
      const result = await updateTablePositionAction(input);

      if (result.error) {
        throw new Error(result.error);
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: tableKeys.all,
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
