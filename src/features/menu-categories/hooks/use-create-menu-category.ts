"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { createMenuCategoryAction } from "../actions/menu-category.actions";
import { menuCategoryKeys } from "../query-keys/menu-category.keys";
import type { CreateMenuCategoryInput } from "../types/menu-category.types";

export function useCreateMenuCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateMenuCategoryInput) => {
      const result = await createMenuCategoryAction(input);

      if (result.error) {
        throw new Error(result.error);
      }

      return result;
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({
        queryKey: menuCategoryKeys.all,
      });

      toast.success(result.success);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
