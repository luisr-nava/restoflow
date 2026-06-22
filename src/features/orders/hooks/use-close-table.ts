"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { closeTableAction } from "../actions/order.actions";
import { reportKeys } from "@/src/features/reports/query-keys/report.keys";
import { tableKeys } from "@/src/features/tables/query-keys/table.keys";
import type { CloseTableInput } from "../types/order.types";
import { orderKeys } from "../query-keys/order.keys";

export function useCloseTable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CloseTableInput) => closeTableAction(input),

    onSuccess: async (response) => {
      if (response.error) {
        toast.error(response.error);
        return;
      }

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: tableKeys.all,
        }),
        queryClient.invalidateQueries({
          queryKey: orderKeys.all,
        }),
        queryClient.invalidateQueries({
          queryKey: orderKeys.activeRoot,
        }),
        queryClient.invalidateQueries({
          queryKey: reportKeys.all,
        }),
      ]);

      toast.success(response.success);
    },

    onError: () => {
      toast.error("No se pudo cerrar la mesa");
    },
  });
}
