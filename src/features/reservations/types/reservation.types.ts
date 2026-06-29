import { z } from "zod";

import type { RestaurantTable } from "@/src/features/tables/types/table.types";

import {
  CancelReservationSchema,
  CreateReservationSchema,
  ReservationStatusSchema,
  UpdateReservationSchema,
} from "../schemas/reservation.schema";

export type ReservationStatus = z.infer<typeof ReservationStatusSchema>;

export type Reservation = {
  id: string;
  restaurant_id: string;
  table_id: string;
  customer_name: string;
  customer_phone: string;
  party_size: number;
  starts_at: string;
  ends_at: string;
  duration_minutes: number;
  notes: string | null;
  status: ReservationStatus;
  created_at: string;
  updated_at: string;
};

export type ReservationWithTable = Reservation & {
  restaurant_tables: RestaurantTable | null;
};

export type CreateReservationInput = z.infer<typeof CreateReservationSchema>;

export type UpdateReservationInput = z.infer<typeof UpdateReservationSchema>;

export type CancelReservationInput = z.infer<typeof CancelReservationSchema>;
