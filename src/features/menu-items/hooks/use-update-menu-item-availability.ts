"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { updateMenuItemAvailabilityAction } from "../actions/menu-item.actions";

type UpdateAvailabilityInput = {
  menuItemId: string;
  isAvailable: boolean;
};

export function useUpdateMenuItemAvailability() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      menuItemId,
      isAvailable,
    }: UpdateAvailabilityInput) => {
      const result = await updateMenuItemAvailabilityAction(
        menuItemId,
        isAvailable,
      );

      if (result.error) {
        throw new Error(result.error);
      }

      return result;
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({
        queryKey: ["menu-items"],
      });

      toast.success(result.success);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
