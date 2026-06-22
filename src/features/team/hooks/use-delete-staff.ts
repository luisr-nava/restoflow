"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { deleteStaffAction } from "../actions/team.actions";
import { teamKeys } from "../query-keys/team.keys";
import type { DeleteStaffInput } from "../types/team.types";

export function useDeleteStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: DeleteStaffInput) => deleteStaffAction(input),

    onSuccess: async (response) => {
      if (response.error) {
        toast.error(response.error);
        return;
      }

      await queryClient.invalidateQueries({
        queryKey: teamKeys.all,
      });

      toast.success(response.success);
    },

    onError: () => {
      toast.error("No se pudo eliminar el personal");
    },
  });
}
