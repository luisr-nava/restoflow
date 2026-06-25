"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { menuItemKeys } from "@/src/features/menu-items/query-keys/menu-item.keys";

import { deleteMenuCategoryAction } from "../actions/menu-category.actions";
import { menuCategoryKeys } from "../query-keys/menu-category.keys";

export function useDeleteMenuCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (categoryId: string) => {
      const result = await deleteMenuCategoryAction(categoryId);

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
