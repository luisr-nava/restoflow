"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { updateMenuCategoryStatusAction } from "../actions/menu-category.actions";

type UpdateMenuCategoryStatusInput = {
  categoryId: string;
  isActive: boolean;
};

export function useUpdateMenuCategoryStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateMenuCategoryStatusInput) =>
      updateMenuCategoryStatusAction(input.categoryId, input.isActive),

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
      toast.error("No se pudo actualizar el estado");
    },
  });
}
