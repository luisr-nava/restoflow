"use client";

import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { createTableOrderAction } from "../actions/order.actions";
import type { CreateTableOrderInput } from "../types/order.types";

export function useCreateTableOrder() {
  return useMutation({
    mutationFn: (input: CreateTableOrderInput) => createTableOrderAction(input),
    onSuccess: (response) => {
      if (response.error) {
        toast.error(response.error);
        return;
      }

      toast.success(response.success);
    },
    onError: () => {
      toast.error("No se pudo crear el pedido");
    },
  });
}
