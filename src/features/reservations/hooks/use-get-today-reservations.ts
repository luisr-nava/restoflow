"use client";

import { useQuery } from "@tanstack/react-query";

import { getTodayReservationsAction } from "../actions/reservation.actions";
import { reservationKeys } from "../query-keys/reservation.keys";

export function useGetTodayReservations() {
  return useQuery({
    queryKey: reservationKeys.today,
    queryFn: getTodayReservationsAction,
  });
}
