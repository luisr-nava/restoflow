"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { tableKeys } from "@/src/features/tables/query-keys/table.keys";
import { createStaffAction } from "../actions/team.actions";
import { teamKeys } from "../query-keys/team.keys";
import type { CreateStaffInput } from "../types/team.types";

export function useCreateStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateStaffInput) => createStaffAction(input),

    onSuccess: async (response) => {
      if (response.error) {
        toast.error(response.error);
        return;
      }

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: teamKeys.all,
        }),
        queryClient.invalidateQueries({
          queryKey: tableKeys.restaurantAll,
        }),
      ]);

      toast.success(response.success);
    },

    onError: () => {
      toast.error("No se pudo crear el personal");
    },
  });
}
