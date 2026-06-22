"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { createMenuItemAction } from "../actions/menu-item.actions";
import { menuItemKeys } from "../query-keys/menu-item.keys";
import type { CreateMenuItemInput } from "../types/menu-item.types";

export function useCreateMenuItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateMenuItemInput) => {
      const result = await createMenuItemAction(input);

      if (result.error) {
        throw new Error(result.error);
      }

      return result;
    },
    onSuccess: async (result) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: menuItemKeys.all,
        }),
        queryClient.invalidateQueries({
          queryKey: menuItemKeys.staffAll,
        }),
      ]);

      toast.success(result.success);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
