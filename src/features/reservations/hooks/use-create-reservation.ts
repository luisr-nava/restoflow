"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { dashboardKeys } from "@/src/features/dashboard/query-keys/dashboard.keys";

import { createReservationAction } from "../actions/reservation.actions";
import { reservationKeys } from "../query-keys/reservation.keys";
import type { CreateReservationInput } from "../types/reservation.types";

export function useCreateReservation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateReservationInput) => {
      const result = await createReservationAction(input);

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
