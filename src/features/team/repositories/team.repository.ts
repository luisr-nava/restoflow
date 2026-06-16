import type { SupabaseClient } from "@supabase/supabase-js";

import type { RestaurantStaff, StaffRole } from "../types/team.types";

type CreateStaffParams = {
  restaurantId: string;
  name: string;
  email?: string;
  role: StaffRole;
  pinHash: string;
};
type UpdateStaffParams = {
  staffId: string;
  name: string;
  email?: string;
  role: StaffRole;
  isActive: boolean;
  pinHash?: string;
};

type DeleteStaffParams = {
  staffId: string;
};

export interface ITeamRepository {
  createStaff(
    supabase: SupabaseClient,
    input: CreateStaffParams,
  ): Promise<{ data: RestaurantStaff | null; error: Error | null }>;

  getStaffByRestaurantId(
    supabase: SupabaseClient,
    restaurantId: string,
  ): Promise<{ data: RestaurantStaff[] | null; error: Error | null }>;

  findStaffById(
    supabase: SupabaseClient,
    staffId: string,
  ): Promise<{ data: RestaurantStaff | null; error: Error | null }>;

  updateStaff(
    supabase: SupabaseClient,
    input: UpdateStaffParams,
  ): Promise<{ data: RestaurantStaff | null; error: Error | null }>;

  deleteStaff(
    supabase: SupabaseClient,
    input: DeleteStaffParams,
  ): Promise<{ error: Error | null }>;
}

class TeamRepository implements ITeamRepository {
  async createStaff(
    supabase: SupabaseClient,
    input: CreateStaffParams,
  ): Promise<{ data: RestaurantStaff | null; error: Error | null }> {
    const { data, error } = await supabase
      .from("restaurant_staff")
      .insert({
        restaurant_id: input.restaurantId,
        name: input.name,
        email: input.email || null,
        role: input.role,
        pin_hash: input.pinHash,
      })
      .select("*")
      .single();

    return { data, error };
  }

  async getStaffByRestaurantId(
    supabase: SupabaseClient,
    restaurantId: string,
  ): Promise<{ data: RestaurantStaff[] | null; error: Error | null }> {
    const { data, error } = await supabase
      .from("restaurant_staff")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .order("created_at", { ascending: false });

    return { data, error };
  }
  async findStaffById(
    supabase: SupabaseClient,
    staffId: string,
  ): Promise<{ data: RestaurantStaff | null; error: Error | null }> {
    const { data, error } = await supabase
      .from("restaurant_staff")
      .select("*")
      .eq("id", staffId)
      .maybeSingle();

    return { data, error };
  }

  async updateStaff(
    supabase: SupabaseClient,
    input: UpdateStaffParams,
  ): Promise<{ data: RestaurantStaff | null; error: Error | null }> {
    const values = {
      name: input.name,
      email: input.email || null,
      role: input.role,
      is_active: input.isActive,
      updated_at: new Date().toISOString(),
      ...(input.pinHash ? { pin_hash: input.pinHash } : {}),
    };

    const { data, error } = await supabase
      .from("restaurant_staff")
      .update(values)
      .eq("id", input.staffId)
      .select("*")
      .single();

    return { data, error };
  }

  async deleteStaff(
    supabase: SupabaseClient,
    input: DeleteStaffParams,
  ): Promise<{ error: Error | null }> {
    const { error } = await supabase
      .from("restaurant_staff")
      .delete()
      .eq("id", input.staffId);

    return { error };
  }
}

export const teamRepository = new TeamRepository();


