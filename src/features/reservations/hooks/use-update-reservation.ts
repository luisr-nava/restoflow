"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { dashboardKeys } from "@/src/features/dashboard/query-keys/dashboard.keys";

import { updateReservationAction } from "../actions/reservation.actions";
import { reservationKeys } from "../query-keys/reservation.keys";
import type { UpdateReservationInput } from "../types/reservation.types";

export function useUpdateReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: UpdateReservationInput) => {
      const result = await updateReservationAction(input);

      if (result.error) {
        throw new Error(result.error);
      }

      return result;
    },
    onSuccess: async (result) => {
      await Promise.all([
        queryClient.invalidateQueries({
          queryKey: reservationKeys.all,
        }),
        queryClient.invalidateQueries({
          queryKey: dashboardKeys.all,
        }),
      ]);

      toast.success(result.success);
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });
}
