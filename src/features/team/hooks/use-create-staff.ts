"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { createStaffAction } from "../actions/team.actions";
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

      await queryClient.invalidateQueries({
        queryKey: ["team"],
      });

      toast.success(response.success);
    },

    onError: () => {
      toast.error("No se pudo crear el personal");
    },
  });
}
