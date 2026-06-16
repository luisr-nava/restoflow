"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { updateStaffAction } from "../actions/team.actions";
import type { UpdateStaffInput } from "../types/team.types";

export function useUpdateStaff() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateStaffInput) => updateStaffAction(input),

    onSuccess: async (response) => {
      if (response.error) {
        toast.error(response.error);
        return;
      }

      await queryClient.invalidateQueries({
        queryKey: ["team"],
      });

      toast.success(response.success);
    },

    onError: () => {
      toast.error("No se pudo actualizar el personal");
    },
  });
}
