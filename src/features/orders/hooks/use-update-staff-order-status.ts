"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { updateStaffOrderStatusAction } from "../actions/order.actions";
import type { UpdateOrderStatusInput } from "../types/order.types";

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
          queryKey: ["staff-orders"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["orders"],
        }),
        queryClient.invalidateQueries({
          queryKey: ["staff-tables"],
        }),
      ]);

      toast.success(response.success);
    },

    onError: () => {
      toast.error("No se pudo actualizar el estado");
    },
  });
}
