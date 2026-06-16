"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { deleteMenuItemAction } from "../actions/menu-item.actions";
import type { DeleteMenuItemInput } from "../types/menu-item.types";

export function useDeleteMenuItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: DeleteMenuItemInput) => deleteMenuItemAction(input),

    onSuccess: async (response) => {
      if (response.error) {
        toast.error(response.error);
        return;
      }

      await queryClient.invalidateQueries({
        queryKey: ["menu-items"],
      });

      toast.success(response.success);
    },

    onError: () => {
      toast.error("No se pudo eliminar el item");
    },
  });
}
