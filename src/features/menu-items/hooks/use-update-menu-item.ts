"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { updateMenuItemAction } from "../actions/menu-item.actions";
import { menuItemKeys } from "../query-keys/menu-item.keys";
import type { UpdateMenuItemInput } from "../types/menu-item.types";

export function useUpdateMenuItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateMenuItemInput) => updateMenuItemAction(input),

    onSuccess: async (response) => {
      if (response.error) {
        toast.error(response.error);
        return;
      }

      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: menuItemKeys.all,
        }),
        queryClient.invalidateQueries({
          queryKey: menuItemKeys.staffAll,
        }),
      ]);

      toast.success(response.success);
    },

    onError: () => {
      toast.error("No se pudo actualizar el item");
    },
  });
}
