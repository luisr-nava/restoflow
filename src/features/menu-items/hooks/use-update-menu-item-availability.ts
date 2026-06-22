"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { updateMenuItemAvailabilityAction } from "../actions/menu-item.actions";
import { menuItemKeys } from "../query-keys/menu-item.keys";

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
