import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  MenuCategory,
  UpdateMenuCategoryInput,
} from "../types/menu-category.types";

export interface IMenuCategoryRepository {
  createCategory(
    supabase: SupabaseClient,
    restaurantId: string,
    name: string,
    sortOrder: number,
  ): Promise<{ data: MenuCategory | null; error: Error | null }>;

  findCategoriesByRestaurantId(
    supabase: SupabaseClient,
    restaurantId: string,
  ): Promise<{ data: MenuCategory[] | null; error: Error | null }>;

  findCategoryById(
    supabase: SupabaseClient,
    categoryId: string,
  ): Promise<{ data: MenuCategory | null; error: Error | null }>;

  findCategoryByName(
    supabase: SupabaseClient,
    restaurantId: string,
    name: string,
  ): Promise<{ data: MenuCategory | null; error: Error | null }>;

  getLastSortOrder(
    supabase: SupabaseClient,
    restaurantId: string,
  ): Promise<{
    data: Pick<MenuCategory, "sort_order"> | null;
    error: Error | null;
  }>;

  updateCategory(
    supabase: SupabaseClient,
    input: UpdateMenuCategoryInput,
  ): Promise<{ data: MenuCategory | null; error: Error | null }>;

  updateCategoryStatus(
    supabase: SupabaseClient,
    categoryId: string,
    isActive: boolean,
  ): Promise<{ data: MenuCategory | null; error: Error | null }>;

  deleteCategory(
    supabase: SupabaseClient,
    categoryId: string,
  ): Promise<{ error: Error | null }>;
}

class MenuCategoryRepository implements IMenuCategoryRepository {
  async createCategory(
    supabase: SupabaseClient,
    restaurantId: string,
    name: string,
    sortOrder: number,
  ): Promise<{ data: MenuCategory | null; error: Error | null }> {
    const { data, error } = await supabase
      .from("menu_categories")
      .insert({
        restaurant_id: restaurantId,
        name,
        sort_order: sortOrder,
      })
      .select("*")
      .single();

    return { data, error };
  }

  async findCategoriesByRestaurantId(
    supabase: SupabaseClient,
    restaurantId: string,
  ): Promise<{ data: MenuCategory[] | null; error: Error | null }> {
    const { data, error } = await supabase
      .from("menu_categories")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .order("sort_order", { ascending: true });

    return { data, error };
  }

  async findCategoryById(
    supabase: SupabaseClient,
    categoryId: string,
  ): Promise<{ data: MenuCategory | null; error: Error | null }> {
    const { data, error } = await supabase
      .from("menu_categories")
      .select("*")
      .eq("id", categoryId)
      .maybeSingle();

    return { data, error };
  }

  async findCategoryByName(
    supabase: SupabaseClient,
    restaurantId: string,
    name: string,
  ): Promise<{ data: MenuCategory | null; error: Error | null }> {
    const { data, error } = await supabase
      .from("menu_categories")
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
    data: Pick<MenuCategory, "sort_order"> | null;
    error: Error | null;
  }> {
    const { data, error } = await supabase
      .from("menu_categories")
      .select("sort_order")
      .eq("restaurant_id", restaurantId)
      .order("sort_order", { ascending: false })
      .limit(1)
      .maybeSingle();

    return { data, error };
  }

  async updateCategory(
    supabase: SupabaseClient,
    input: UpdateMenuCategoryInput,
  ): Promise<{ data: MenuCategory | null; error: Error | null }> {
    const { data, error } = await supabase
      .from("menu_categories")
      .update({
        name: input.name,
      })
      .eq("id", input.categoryId)
      .select("*")
      .single();

    return { data, error };
  }

  async updateCategoryStatus(
    supabase: SupabaseClient,
    categoryId: string,
    isActive: boolean,
  ): Promise<{ data: MenuCategory | null; error: Error | null }> {
    const { data, error } = await supabase
      .from("menu_categories")
      .update({
        is_active: isActive,
      })
      .eq("id", categoryId)
      .select("*")
      .single();

    return { data, error };
  }

  async deleteCategory(
    supabase: SupabaseClient,
    categoryId: string,
  ): Promise<{ error: Error | null }> {
    const { error } = await supabase
      .from("menu_categories")
      .delete()
      .eq("id", categoryId);

    return { error };
  }
}

export const menuCategoryRepository = new MenuCategoryRepository();
