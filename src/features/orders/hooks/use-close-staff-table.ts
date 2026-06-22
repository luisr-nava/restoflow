"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { closeStaffTableAction } from "../actions/order.actions";
import { reportKeys } from "@/src/features/reports/query-keys/report.keys";
import { tableKeys } from "@/src/features/tables/query-keys/table.keys";
import type { CloseTableInput } from "../types/order.types";
import { orderKeys } from "../query-keys/order.keys";

export function useCloseStaffTable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CloseTableInput) => closeStaffTableAction(input),

    onSuccess: async (response) => {
      if (response.error) {
        toast.error(response.error);
        return;
      }

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: tableKeys.staffAll }),
        queryClient.invalidateQueries({ queryKey: orderKeys.all }),
        queryClient.invalidateQueries({ queryKey: orderKeys.staffOpenRoot }),
        queryClient.invalidateQueries({ queryKey: reportKeys.all }),
      ]);

      toast.success(response.success);
    },

    onError: () => {
      toast.error("No se pudo cerrar la mesa");
    },
  });
}
