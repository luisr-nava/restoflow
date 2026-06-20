import type { SupabaseClient } from "@supabase/supabase-js";

import type { RestaurantStaff } from "../types/team.types";

export interface IStaffAuthRepository {
  findStaffByEmail(
    supabase: SupabaseClient,
    email: string,
  ): Promise<{ data: RestaurantStaff | null; error: Error | null }>;
}

class StaffAuthRepository implements IStaffAuthRepository {
  async findStaffByEmail(
    supabase: SupabaseClient,
    email: string,
  ): Promise<{ data: RestaurantStaff | null; error: Error | null }> {
    const normalizedEmail = email.trim().toLowerCase();

    const { data, error } = await supabase
      .from("restaurant_staff")
      .select("*")
      .ilike("email", normalizedEmail)
      .maybeSingle();

    return { data, error };
  }
}

export const staffAuthRepository = new StaffAuthRepository();

