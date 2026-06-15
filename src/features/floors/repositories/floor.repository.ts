import type { SupabaseClient } from "@supabase/supabase-js";

import type { RestaurantFloor } from "../types/floor.types";

export interface IFloorRepository {
  createFloor(
    supabase: SupabaseClient,
    restaurantId: string,
    name: string,
    sortOrder: number,
  ): Promise<{ data: RestaurantFloor | null; error: Error | null }>;

  findFloorsByRestaurantId(
    supabase: SupabaseClient,
    restaurantId: string,
  ): Promise<{ data: RestaurantFloor[] | null; error: Error | null }>;

  findFloorByName(
    supabase: SupabaseClient,
    restaurantId: string,
    name: string,
  ): Promise<{ data: RestaurantFloor | null; error: Error | null }>;

  getLastSortOrder(
    supabase: SupabaseClient,
    restaurantId: string,
  ): Promise<{
    data: Pick<RestaurantFloor, "sort_order"> | null;
    error: Error | null;
  }>;
  findFloorById(
    supabase: SupabaseClient,
    floorId: string,
  ): Promise<{ data: RestaurantFloor | null; error: Error | null }>;

  deleteFloor(
    supabase: SupabaseClient,
    floorId: string,
  ): Promise<{ error: Error | null }>;
}

class FloorRepository implements IFloorRepository {
  async createFloor(
    supabase: SupabaseClient,
    restaurantId: string,
    name: string,
    sortOrder: number,
  ): Promise<{ data: RestaurantFloor | null; error: Error | null }> {
    const { data, error } = await supabase
      .from("restaurant_floors")
      .insert({
        restaurant_id: restaurantId,
        name,
        sort_order: sortOrder,
      })
      .select("*")
      .single();

    return { data, error };
  }

  async findFloorsByRestaurantId(
    supabase: SupabaseClient,
    restaurantId: string,
  ): Promise<{ data: RestaurantFloor[] | null; error: Error | null }> {
    const { data, error } = await supabase
      .from("restaurant_floors")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .order("sort_order", { ascending: true });

    return { data, error };
  }

  async findFloorByName(
    supabase: SupabaseClient,
    restaurantId: string,
    name: string,
  ): Promise<{ data: RestaurantFloor | null; error: Error | null }> {
    const { data, error } = await supabase
      .from("restaurant_floors")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .ilike("name", name)
      .maybeSingle();

    return { data, error };
  }

  async getLastSortOrder(
    supabase: SupabaseClient,
    restaurantId: string,
  ): Promise<{
    data: Pick<RestaurantFloor, "sort_order"> | null;
    error: Error | null;
  }> {
    const { data, error } = await supabase
      .from("restaurant_floors")
      .select("sort_order")
      .eq("restaurant_id", restaurantId)
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();

    return { data, error };
  }

  async findFloorById(
    supabase: SupabaseClient,
    floorId: string,
  ): Promise<{ data: RestaurantFloor | null; error: Error | null }> {
    const { data, error } = await supabase
      .from("restaurant_floors")
      .select("*")
      .eq("id", floorId)
      .maybeSingle();

    return { data, error };
  }

  async deleteFloor(
    supabase: SupabaseClient,
    floorId: string,
  ): Promise<{ error: Error | null }> {
    const { error } = await supabase
      .from("restaurant_floors")
      .delete()
      .eq("id", floorId);

    return { error };
  }
}

export const floorRepository = new FloorRepository();


