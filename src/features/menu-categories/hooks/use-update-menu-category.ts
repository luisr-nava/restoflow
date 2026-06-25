"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { menuItemKeys } from "@/src/features/menu-items/query-keys/menu-item.keys";

import { updateMenuCategoryAction } from "../actions/menu-category.actions";
import { menuCategoryKeys } from "../query-keys/menu-category.keys";
import type { UpdateMenuCategoryInput } from "../types/menu-category.types";

export function useUpdateMenuCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateMenuCategoryInput) => {
      const result = await updateMenuCategoryAction(input);

      if (result.error) {
        throw new Error(result.error);
      }

      return result;
    },

    onSuccess: async (result) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: menuCategoryKeys.all,
        }),
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
