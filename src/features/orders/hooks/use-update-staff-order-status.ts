"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { updateStaffOrderStatusAction } from "../actions/order.actions";
import type { UpdateOrderStatusInput } from "../types/order.types";

export function useUpdateStaffOrderStatus() {
  return useMutation({
    mutationFn: (input: UpdateOrderStatusInput) =>
      updateStaffOrderStatusAction(input),

    onSuccess: (response) => {
      if (response.error) {
        toast.error(response.error);
        return;
      }

      toast.success(response.success);
    },

    onError: () => {
      toast.error("No se pudo actualizar el estado");
    },
  });
}
