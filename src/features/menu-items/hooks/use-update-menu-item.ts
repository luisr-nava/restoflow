"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { updateMenuItemAction } from "../actions/menu-item.actions";
import type { UpdateMenuItemInput } from "../types/menu-item.types";
import { invalidateObservedMenuItemQueries } from "./invalidate-observed-menu-item-queries";

export function useUpdateMenuItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateMenuItemInput) => {
      const result = await updateMenuItemAction(input);

      if (result.error) {
        throw new Error(result.error);
      }

      return result;
    },

    onSuccess: async (result) => {
      await invalidateObservedMenuItemQueries(queryClient);

      toast.success(result.success);
    },

    onError: (error) => {
      toast.error(error.message);
    },
  });
}
