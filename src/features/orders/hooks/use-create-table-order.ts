"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createTableOrderAction } from "../actions/order.actions";
import type { CreateTableOrderInput } from "../types/order.types";

export function useCreateTableOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateTableOrderInput) => createTableOrderAction(input),
    onSuccess: async (response) => {
      if (response.error) {
        toast.error(response.error);
        return;
      }

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["tables"] }),
        queryClient.invalidateQueries({ queryKey: ["orders"] }),
      ]);

      toast.success(response.success);
    },
    onError: () => {
      toast.error("No se pudo crear el pedido");
    },
  });
}
