"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { createFloorAction } from "../actions/floor.actions";
import { floorKeys } from "../query-keys/floor.keys";
import type { CreateFloorInput } from "../types/floor.types";

export function useCreateFloor() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateFloorInput) => {
      const result = await createFloorAction(input);

      if (result.error) {
        throw new Error(result.error);
      }

      return result;
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: floorKeys.all });
      toast.success(result.success);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
