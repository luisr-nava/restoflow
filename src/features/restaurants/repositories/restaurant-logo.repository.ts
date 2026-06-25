import type { SupabaseClient } from "@supabase/supabase-js";

export const RESTAURANT_LOGOS_BUCKET = "restaurant-logos";

export interface IRestaurantLogoRepository {
  upload(
    supabase: SupabaseClient,
    path: string,
    file: File,
  ): Promise<{ path: string; error: Error | null }>;

  getPublicUrl(supabase: SupabaseClient, path: string): string;

  remove(
    supabase: SupabaseClient,
    path: string,
  ): Promise<{ error: Error | null }>;
}

class RestaurantLogoRepository implements IRestaurantLogoRepository {
  async upload(
    supabase: SupabaseClient,
    path: string,
    file: File,
  ): Promise<{ path: string; error: Error | null }> {
    const { data, error } = await supabase.storage
      .from(RESTAURANT_LOGOS_BUCKET)
      .upload(path, file);

    return {
      path: data?.path ?? "",
      error,
    };
  }

  getPublicUrl(supabase: SupabaseClient, path: string) {
    const { data } = supabase.storage
      .from(RESTAURANT_LOGOS_BUCKET)
      .getPublicUrl(path);

    return data.publicUrl;
  }

  async remove(
    supabase: SupabaseClient,
    path: string,
  ): Promise<{ error: Error | null }> {
    const { error } = await supabase.storage
      .from(RESTAURANT_LOGOS_BUCKET)
      .remove([path]);

    return { error };
  }
}

export const restaurantLogoRepository = new RestaurantLogoRepository();
