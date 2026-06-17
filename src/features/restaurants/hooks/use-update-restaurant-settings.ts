import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { updateRestaurantSettingsAction } from "../actions/restaurant.actions";
import type { UpdateRestaurantInput } from "../types/restaurant.types";

export function useUpdateRestaurantSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: UpdateRestaurantInput) =>
      updateRestaurantSettingsAction(input),

    onSuccess: async (response) => {
      if (response.error) {
        toast.error(response.error);
        return;
      }

      await queryClient.invalidateQueries({
        queryKey: ["restaurant-settings"],
      });

      toast.success(response.success);
    },

    onError: () => {
      toast.error("No se pudo actualizar la configuración");
    },
  });
}
