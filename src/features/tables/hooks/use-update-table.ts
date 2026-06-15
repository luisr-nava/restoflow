"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { updateTableAction } from "../actions/table.actions";
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
    onSuccess: (result) => {
      queryClient.invalidateQueries({
        queryKey: ["tables"],
      });

      toast.success(result.success);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
