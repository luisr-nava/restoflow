"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { deleteTableAction } from "../actions/table.actions";

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
