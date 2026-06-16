"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { updateMenuCategoryAction } from "../actions/menu-category.actions";
import type { UpdateMenuCategoryInput } from "../types/menu-category.types";

export function useUpdateMenuCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateMenuCategoryInput) =>
      updateMenuCategoryAction(input),

    onSuccess: async (response) => {
      if (response.error) {
        toast.error(response.error);
        return;
      }

      await queryClient.invalidateQueries({
        queryKey: ["menu-categories"],
      });

      toast.success(response.success);
    },

    onError: () => {
      toast.error("No se pudo actualizar la categoría");
    },
  });
}
