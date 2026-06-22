"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { createStaffTableOrderAction } from "../actions/order.actions";
import { tableKeys } from "@/src/features/tables/query-keys/table.keys";
import type { CreateTableOrderInput } from "../types/order.types";
import { orderKeys } from "../query-keys/order.keys";

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
          queryKey: tableKeys.staffAll,
        }),
        queryClient.invalidateQueries({
          queryKey: orderKeys.staffOpen(input.tableId),
        }),
        queryClient.invalidateQueries({
          queryKey: orderKeys.all,
        }),
      ]);

      toast.success(response.success);
    },

    onError: () => {
      toast.error("No se pudo crear el pedido");
    },
  });
}
