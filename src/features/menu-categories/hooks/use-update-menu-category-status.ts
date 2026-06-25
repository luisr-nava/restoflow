"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { menuItemKeys } from "@/src/features/menu-items/query-keys/menu-item.keys";

import { updateMenuCategoryStatusAction } from "../actions/menu-category.actions";
import { menuCategoryKeys } from "../query-keys/menu-category.keys";

type UpdateMenuCategoryStatusInput = {
  categoryId: string;
  isActive: boolean;
};

export function useUpdateMenuCategoryStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateMenuCategoryStatusInput) => {
      const result = await updateMenuCategoryStatusAction(
        input.categoryId,
        input.isActive,
      );

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
