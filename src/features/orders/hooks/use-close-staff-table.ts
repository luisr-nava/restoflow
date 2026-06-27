"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { closeStaffTableAction } from "../actions/order.actions";
import { reportKeys } from "@/src/features/reports/query-keys/report.keys";
import type { CloseTableInput } from "../types/order.types";

export function useCloseStaffTable() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CloseTableInput) => closeStaffTableAction(input),

    onSuccess: async (response) => {
      if (response.error) {
        toast.error(response.error);
        return;
      }

      await queryClient.invalidateQueries({ queryKey: reportKeys.all });

      toast.success(response.success);
    },

    onError: () => {
      toast.error("No se pudo cerrar la mesa");
    },
  });
}
