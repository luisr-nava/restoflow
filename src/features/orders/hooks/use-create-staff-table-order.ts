"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { createStaffTableOrderAction } from "../actions/order.actions";
import type { CreateTableOrderInput } from "../types/order.types";

export function useCreateStaffTableOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTableOrderInput) =>
      createStaffTableOrderAction(input),

    onSuccess: async (response, input) => {
      if (response.error) {
        toast.error(response.error);
        return;
      }

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["staff-tables"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["staff-open-order", input.tableId],
        }),
        queryClient.invalidateQueries({
          queryKey: ["orders"],
        }),
      ]);

      toast.success(response.success);
    },

    onError: () => {
      toast.error("No se pudo crear el pedido");
    },
  });
}
