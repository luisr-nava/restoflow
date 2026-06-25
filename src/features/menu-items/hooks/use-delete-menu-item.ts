"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { deleteMenuItemAction } from "../actions/menu-item.actions";
import { menuItemKeys } from "../query-keys/menu-item.keys";
import type { DeleteMenuItemInput } from "../types/menu-item.types";

export function useDeleteMenuItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: DeleteMenuItemInput) => {
      const result = await deleteMenuItemAction(input);

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
