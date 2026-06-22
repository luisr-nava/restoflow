"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { updateStaffOrderStatusAction } from "../actions/order.actions";
import { tableKeys } from "@/src/features/tables/query-keys/table.keys";
import type { UpdateOrderStatusInput } from "../types/order.types";
import { orderKeys } from "../query-keys/order.keys";

export function useUpdateStaffOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateOrderStatusInput) =>
      updateStaffOrderStatusAction(input),

    onSuccess: async (response) => {
      if (response.error) {
        toast.error(response.error);
        return;
      }

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: orderKeys.staffAll,
        }),
        queryClient.invalidateQueries({
          queryKey: orderKeys.all,
        }),
        queryClient.invalidateQueries({
          queryKey: tableKeys.staffAll,
        }),
      ]);

      toast.success(response.success);
    },

    onError: () => {
      toast.error("No se pudo actualizar el estado");
    },
  });
}
