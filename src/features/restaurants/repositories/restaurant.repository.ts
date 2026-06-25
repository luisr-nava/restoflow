import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  CreateRestaurantInput,
  Restaurant,
  RestaurantMember,
  RestaurantRole,
  UpdateRestaurantInput,
} from "../types/restaurant.types";

type CreateRestaurantParams = CreateRestaurantInput & {
  slug: string;
  ownerId: string;
};

export interface IRestaurantRepository {
  createRestaurant(
    supabase: SupabaseClient,
    input: CreateRestaurantParams,
  ): Promise<{ data: Restaurant | null; error: Error | null }>;

  createRestaurantMember(
    supabase: SupabaseClient,
    restaurantId: string,
    userId: string,
    role: RestaurantRole,
  ): Promise<{ data: RestaurantMember | null; error: Error | null }>;

  findRestaurantByOwnerId(
    supabase: SupabaseClient,
    ownerId: string,
  ): Promise<{ data: Restaurant | null; error: Error | null }>;

  findMemberByUserId(
    supabase: SupabaseClient,
    userId: string,
  ): Promise<{ data: RestaurantMember | null; error: Error | null }>;

  findRestaurantById(
    supabase: SupabaseClient,
    restaurantId: string,
  ): Promise<{ data: Restaurant | null; error: Error | null }>;

  updateRestaurant(
    supabase: SupabaseClient,
    restaurantId: string,
    input: UpdateRestaurantInput,
  ): Promise<{ data: Restaurant | null; error: Error | null }>;
}

class RestaurantRepository implements IRestaurantRepository {
  async createRestaurant(
    supabase: SupabaseClient,
    input: CreateRestaurantParams,
  ): Promise<{ data: Restaurant | null; error: Error | null }> {
    const { data, error } = await supabase
      .from("restaurants")
      .insert({
        name: input.name,
        slug: input.slug,
        address: input.address,
        phone: input.phone || null,
        email: input.email || null,
        tax_id: input.taxId || null,
        currency: input.currency,
        timezone: input.timezone,
        logo_url: input.logoUrl || null,
        owner_id: input.ownerId,
      })
      .select("*")
      .single();

    return { data, error };
  }

  async createRestaurantMember(
    supabase: SupabaseClient,
    restaurantId: string,
    userId: string,
    role: RestaurantRole,
  ): Promise<{ data: RestaurantMember | null; error: Error | null }> {
    const { data, error } = await supabase
      .from("restaurant_members")
      .insert({
        restaurant_id: restaurantId,
        user_id: userId,
        role,
      })
      .select("*")
      .single();

    return { data, error };
  }

  async findRestaurantByOwnerId(
    supabase: SupabaseClient,
    ownerId: string,
  ): Promise<{ data: Restaurant | null; error: Error | null }> {
    const { data, error } = await supabase
      .from("restaurants")
      .select("*")
      .eq("owner_id", ownerId)
      .maybeSingle();

    return { data, error };
  }

  async findMemberByUserId(
    supabase: SupabaseClient,
    userId: string,
  ): Promise<{ data: RestaurantMember | null; error: Error | null }> {
    const { data, error } = await supabase
      .from("restaurant_members")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    return { data, error };
  }

  async findRestaurantById(
    supabase: SupabaseClient,
    restaurantId: string,
  ): Promise<{ data: Restaurant | null; error: Error | null }> {
    const { data, error } = await supabase
      .from("restaurants")
      .select("*")
      .eq("id", restaurantId)
      .maybeSingle();

    return { data, error };
  }

  async updateRestaurant(
    supabase: SupabaseClient,
    restaurantId: string,
    input: UpdateRestaurantInput,
  ): Promise<{ data: Restaurant | null; error: Error | null }> {
    const { data, error } = await supabase
      .from("restaurants")
      .update({
        name: input.name,
        address: input.address,
        phone: input.phone || null,
        email: input.email || null,
        tax_id: input.taxId || null,
        currency: input.currency,
        timezone: input.timezone,
        logo_url: input.logoUrl || null,
      })
      .eq("id", restaurantId);

    return {
      data: null,
      error,
    };
  }
}

export const restaurantRepository = new RestaurantRepository();

