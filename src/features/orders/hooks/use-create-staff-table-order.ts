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

    onSuccess: (response) => {
      if (response.error) {
        toast.error(response.error);
        return;
      }

      toast.success(response.success);

      queryClient.invalidateQueries({
        queryKey: ["staff-tables"],
      });

      queryClient.invalidateQueries({
        queryKey: ["active-order"],
      });

      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });
    },

    onError: () => {
      toast.error("No se pudo crear el pedido");
    },
  });
}
