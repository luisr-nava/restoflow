import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  RestaurantTable,
  TableStatus,
  UpdateTableInput,
  UpdateTablePositionInput,
} from "../types/table.types";

type CreateTableParams = {
  restaurantId: string;
  floorId: string;
  waiterId?: string;
  name: string;
  seats: number;
};

export interface ITableRepository {
  createTable(
    supabase: SupabaseClient,
    input: CreateTableParams,
  ): Promise<{ data: RestaurantTable | null; error: Error | null }>;

  findTablesByFloorId(
    supabase: SupabaseClient,
    floorId: string,
  ): Promise<{ data: RestaurantTable[] | null; error: Error | null }>;

  findTableById(
    supabase: SupabaseClient,
    tableId: string,
  ): Promise<{ data: RestaurantTable | null; error: Error | null }>;

  updateTablePosition(
    supabase: SupabaseClient,
    input: UpdateTablePositionInput,
  ): Promise<{ data: RestaurantTable | null; error: Error | null }>;

  updateTableStatus(
    supabase: SupabaseClient,
    tableId: string,
    status: TableStatus,
  ): Promise<{ data: RestaurantTable | null; error: Error | null }>;

  updateTable(
    supabase: SupabaseClient,
    input: UpdateTableInput,
  ): Promise<{ data: RestaurantTable | null; error: Error | null }>;

  deleteTable(
    supabase: SupabaseClient,
    tableId: string,
  ): Promise<{ error: Error | null }>;

  findTablesByFloorIdForDelete(
    supabase: SupabaseClient,
    floorId: string,
  ): Promise<{ data: RestaurantTable[] | null; error: Error | null }>;

  deleteTablesByFloorId(
    supabase: SupabaseClient,
    floorId: string,
  ): Promise<{ error: Error | null }>;

  findTableByQrToken(
    supabase: SupabaseClient,
    qrToken: string,
  ): Promise<{ data: RestaurantTable | null; error: Error | null }>;
}

class TableRepository implements ITableRepository {
  async createTable(
    supabase: SupabaseClient,
    input: CreateTableParams,
  ): Promise<{ data: RestaurantTable | null; error: Error | null }> {
    const { data, error } = await supabase
      .from("restaurant_tables")
      .insert({
        restaurant_id: input.restaurantId,
        floor_id: input.floorId,
        waiter_id: input.waiterId || null,
        name: input.name,
        seats: input.seats,
        status: "AVAILABLE",
        x: 24,
        y: 24,
        width: 120,
        height: 80,
      })
      .select("*")
      .single();

    return { data, error };
  }

  async findTablesByFloorId(
    supabase: SupabaseClient,
    floorId: string,
  ): Promise<{ data: RestaurantTable[] | null; error: Error | null }> {
    const { data, error } = await supabase
      .from("restaurant_tables")
      .select("*")
      .eq("floor_id", floorId)
      .order("created_at", { ascending: true });

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

  async updateTablePosition(
    supabase: SupabaseClient,
    input: UpdateTablePositionInput,
  ): Promise<{ data: RestaurantTable | null; error: Error | null }> {
    const { data, error } = await supabase
      .from("restaurant_tables")
      .update({
        x: input.x,
        y: input.y,
        width: input.width,
        height: input.height,
      })
      .eq("id", input.tableId)
      .select("*")
      .single();

    return { data, error };
  }

  async updateTableStatus(
    supabase: SupabaseClient,
    tableId: string,
    status: TableStatus,
  ): Promise<{ data: RestaurantTable | null; error: Error | null }> {
    const { data, error } = await supabase
      .from("restaurant_tables")
      .update({ status })
      .eq("id", tableId)
      .select("*")
      .single();

    return { data, error };
  }

  async updateTable(
    supabase: SupabaseClient,
    input: UpdateTableInput,
  ): Promise<{ data: RestaurantTable | null; error: Error | null }> {
    const { data, error } = await supabase
      .from("restaurant_tables")
      .update({
        name: input.name,
        seats: input.seats,
        waiter_id: input.waiterId || null,
      })
      .eq("id", input.tableId)
      .select("*")
      .single();

    return { data, error };
  }
  async deleteTable(
    supabase: SupabaseClient,
    tableId: string,
  ): Promise<{ error: Error | null }> {
    const { error } = await supabase
      .from("restaurant_tables")
      .delete()
      .eq("id", tableId);

    return { error };
  }

  async findTablesByFloorIdForDelete(
    supabase: SupabaseClient,
    floorId: string,
  ): Promise<{ data: RestaurantTable[] | null; error: Error | null }> {
    const { data, error } = await supabase
      .from("restaurant_tables")
      .select("*")
      .eq("floor_id", floorId);

    return { data, error };
  }
  async deleteTablesByFloorId(
    supabase: SupabaseClient,
    floorId: string,
  ): Promise<{ error: Error | null }> {
    const { error } = await supabase
      .from("restaurant_tables")
      .delete()
      .eq("floor_id", floorId);

    return { error };
  }

  async findTableByQrToken(
    supabase: SupabaseClient,
    qrToken: string,
  ): Promise<{ data: RestaurantTable | null; error: Error | null }> {
    const { data, error } = await supabase
      .from("restaurant_tables")
      .select("*")
      .eq("qr_token", qrToken)
      .maybeSingle();

    return { data, error };
  }
}

export const tableRepository = new TableRepository();



