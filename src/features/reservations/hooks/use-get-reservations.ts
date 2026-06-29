"use client";

import { useQuery } from "@tanstack/react-query";

import { getReservationsAction } from "../actions/reservation.actions";
import { reservationKeys } from "../query-keys/reservation.keys";

export function useGetReservations() {
  return useQuery({
    queryKey: reservationKeys.all,
    queryFn: getReservationsAction,
  });
}
