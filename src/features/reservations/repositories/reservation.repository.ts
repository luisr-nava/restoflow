import type { SupabaseClient } from "@supabase/supabase-js";

import type { RestaurantTable } from "@/src/features/tables/types/table.types";

import type {
  CancelReservationInput,
  CreateReservationInput,
  Reservation,
  ReservationStatus,
  ReservationWithTable,
  UpdateReservationInput,
} from "../types/reservation.types";

type CreateReservationParams = CreateReservationInput & {
  endsAt: string;
  restaurantId: string;
};

type UpdateReservationParams = UpdateReservationInput & {
  endsAt: string;
};

type FindTodayReservationsParams = {
  restaurantId: string;
  dayStart: string;
  dayEnd: string;
};

type FindReservationOverlappingParams = {
  tableId: string;
  startsAt: string;
  endsAt: string;
  excludeReservationId?: string;
  statuses?: ReservationStatus[];
};

const reservationWithTableSelect = `
  *,
  restaurant_tables (*)
`;

export interface IReservationRepository {
  createReservation(
    supabase: SupabaseClient,
    input: CreateReservationParams,
  ): Promise<{ data: Reservation | null; error: Error | null }>;

  updateReservation(
    supabase: SupabaseClient,
    input: UpdateReservationParams,
  ): Promise<{ data: Reservation | null; error: Error | null }>;

  cancelReservation(
    supabase: SupabaseClient,
    input: CancelReservationInput,
  ): Promise<{ data: Reservation | null; error: Error | null }>;

  findReservationById(
    supabase: SupabaseClient,
    reservationId: string,
  ): Promise<{ data: ReservationWithTable | null; error: Error | null }>;

  findReservationsByRestaurantId(
    supabase: SupabaseClient,
    restaurantId: string,
  ): Promise<{ data: ReservationWithTable[] | null; error: Error | null }>;

  findTodayReservationsByRestaurantId(
    supabase: SupabaseClient,
    input: FindTodayReservationsParams,
  ): Promise<{ data: ReservationWithTable[] | null; error: Error | null }>;

  findReservationOverlapping(
    supabase: SupabaseClient,
    input: FindReservationOverlappingParams,
  ): Promise<{ data: Reservation | null; error: Error | null }>;

  findTableById(
    supabase: SupabaseClient,
    tableId: string,
  ): Promise<{ data: RestaurantTable | null; error: Error | null }>;
}

class ReservationRepository implements IReservationRepository {
  async createReservation(
    supabase: SupabaseClient,
    input: CreateReservationParams,
  ): Promise<{ data: Reservation | null; error: Error | null }> {
    const { data, error } = await supabase
      .from("reservations")
      .insert({
        restaurant_id: input.restaurantId,
        table_id: input.tableId,
        customer_name: input.customerName,
        customer_phone: input.customerPhone,
        party_size: input.partySize,
        starts_at: input.startsAt,
        ends_at: input.endsAt,
        duration_minutes: input.durationMinutes,
        notes: input.notes || null,
        status: "ACTIVE",
      })
      .select("*")
      .single();

    return { data, error };
  }

  async updateReservation(
    supabase: SupabaseClient,
    input: UpdateReservationParams,
  ): Promise<{ data: Reservation | null; error: Error | null }> {
    const { data, error } = await supabase
      .from("reservations")
      .update({
        table_id: input.tableId,
        customer_name: input.customerName,
        customer_phone: input.customerPhone,
        party_size: input.partySize,
        starts_at: input.startsAt,
        ends_at: input.endsAt,
        duration_minutes: input.durationMinutes,
        notes: input.notes || null,
        status: input.status,
      })
      .eq("id", input.reservationId)
      .select("*")
      .single();

    return { data, error };
  }

  async cancelReservation(
    supabase: SupabaseClient,
    input: CancelReservationInput,
  ): Promise<{ data: Reservation | null; error: Error | null }> {
    const { data, error } = await supabase
      .from("reservations")
      .update({
        status: "CANCELED",
      })
      .eq("id", input.reservationId)
      .select("*")
      .single();

    return { data, error };
  }

  async findReservationById(
    supabase: SupabaseClient,
    reservationId: string,
  ): Promise<{ data: ReservationWithTable | null; error: Error | null }> {
    const { data, error } = await supabase
      .from("reservations")
      .select(reservationWithTableSelect)
      .eq("id", reservationId)
      .maybeSingle();

    return { data, error };
  }

  async findReservationsByRestaurantId(
    supabase: SupabaseClient,
    restaurantId: string,
  ): Promise<{ data: ReservationWithTable[] | null; error: Error | null }> {
    const { data, error } = await supabase
      .from("reservations")
      .select(reservationWithTableSelect)
      .eq("restaurant_id", restaurantId)
      .order("starts_at", { ascending: true });

    return { data, error };
  }

  async findTodayReservationsByRestaurantId(
    supabase: SupabaseClient,
    input: FindTodayReservationsParams,
  ): Promise<{ data: ReservationWithTable[] | null; error: Error | null }> {
    const { data, error } = await supabase
      .from("reservations")
      .select(reservationWithTableSelect)
      .eq("restaurant_id", input.restaurantId)
      .gte("starts_at", input.dayStart)
      .lt("starts_at", input.dayEnd)
      .order("starts_at", { ascending: true });

    return { data, error };
  }

  async findReservationOverlapping(
    supabase: SupabaseClient,
    input: FindReservationOverlappingParams,
  ): Promise<{ data: Reservation | null; error: Error | null }> {
    let query = supabase
      .from("reservations")
      .select("*")
      .eq("table_id", input.tableId)
      .lt("starts_at", input.endsAt)
      .gt("ends_at", input.startsAt)
      .order("starts_at", { ascending: true })
      .limit(1);

    if (input.excludeReservationId) {
      query = query.neq("id", input.excludeReservationId);
    }

    if (input.statuses && input.statuses.length > 0) {
      query = query.in("status", input.statuses);
    }

    const { data, error } = await query.maybeSingle();

    return { data, error };
  }

  async findTableById(
    supabase: SupabaseClient,
    tableId: string,
  ): Promise<{ data: RestaurantTable | null; error: Error | null }> {
    const { data, error } = await supabase
      .from("restaurant_tables")
      .select("*")
      .eq("id", tableId)
      .maybeSingle();

    return { data, error };
  }
}

export const reservationRepository = new ReservationRepository();
