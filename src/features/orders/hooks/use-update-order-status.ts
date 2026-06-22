"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { updateOrderStatusAction } from "../actions/order.actions";
import { tableKeys } from "@/src/features/tables/query-keys/table.keys";
import type { UpdateOrderStatusInput } from "../types/order.types";
import { orderKeys } from "../query-keys/order.keys";

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateOrderStatusInput) =>
      updateOrderStatusAction(input),

    onSuccess: async (response) => {
      if (response.error) {
        toast.error(response.error);
        return;
      }

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: orderKeys.all,
        }),
        queryClient.invalidateQueries({
          queryKey: tableKeys.all,
        }),
      ]);

      toast.success(response.success);
    },

    onError: () => {
      toast.error("No se pudo actualizar el estado");
    },
  });
}
