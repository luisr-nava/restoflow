import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  CreateMenuItemInput,
  MenuItem,
  MenuItemWithCategory,
  UpdateMenuItemInput,
} from "../types/menu-item.types";
export const MENU_ITEM_IMAGES_BUCKET = "menu-item-images";
export interface IMenuItemRepository {
  createMenuItem(
    supabase: SupabaseClient,
    restaurantId: string,
    input: CreateMenuItemInput,
  ): Promise<{ data: MenuItem | null; error: Error | null }>;

  findMenuItemsByRestaurantId(
    supabase: SupabaseClient,
    restaurantId: string,
  ): Promise<{ data: MenuItemWithCategory[] | null; error: Error | null }>;

  findMenuItemById(
    supabase: SupabaseClient,
    menuItemId: string,
  ): Promise<{ data: MenuItemWithCategory | null; error: Error | null }>;

  countItemsByCategoryId(
    supabase: SupabaseClient,
    categoryId: string,
  ): Promise<{ count: number | null; error: Error | null }>;

  updateMenuItem(
    supabase: SupabaseClient,
    input: UpdateMenuItemInput,
  ): Promise<{ data: MenuItem | null; error: Error | null }>;

  updateAvailability(
    supabase: SupabaseClient,
    menuItemId: string,
    isAvailable: boolean,
  ): Promise<{ data: MenuItem | null; error: Error | null }>;

  deleteMenuItem(
    supabase: SupabaseClient,
    menuItemId: string,
  ): Promise<{ error: Error | null }>;

  uploadImage(
    supabase: SupabaseClient,
    path: string,
    file: File,
  ): Promise<{ path: string; error: Error | null }>;

  getImagePublicUrl(supabase: SupabaseClient, path: string): string;

  removeImage(
    supabase: SupabaseClient,
    path: string,
  ): Promise<{ error: Error | null }>;
}

class MenuItemRepository implements IMenuItemRepository {
  async createMenuItem(
    supabase: SupabaseClient,
    restaurantId: string,
    input: CreateMenuItemInput,
  ): Promise<{ data: MenuItem | null; error: Error | null }> {
    const { data, error } = await supabase
      .from("menu_items")
      .insert({
        restaurant_id: restaurantId,
        name: input.name,
        description: input.description || null,
        price: input.price,
        category_id: input.categoryId || null,
        image_url: input.imageUrl || null,
        is_available: input.isAvailable,
      })
      .select("*")
      .single();

    return { data, error };
  }

  async findMenuItemsByRestaurantId(
    supabase: SupabaseClient,
    restaurantId: string,
  ): Promise<{ data: MenuItemWithCategory[] | null; error: Error | null }> {
    const { data, error } = await supabase
      .from("menu_items")
      .select(
        `
      *,
      menu_categories (
        id,
        name,
        is_active
      )
    `,
      )
      .eq("restaurant_id", restaurantId)
      .order("name", { ascending: true });

    return { data, error };
  }

  async findMenuItemById(
    supabase: SupabaseClient,
    menuItemId: string,
  ): Promise<{ data: MenuItemWithCategory | null; error: Error | null }> {
    const { data, error } = await supabase
      .from("menu_items")
      .select(
        `
      *,
      menu_categories (
        id,
        name,
        is_active
      )
    `,
      )
      .eq("id", menuItemId)
      .maybeSingle();

    return { data, error };
  }

  async countItemsByCategoryId(
    supabase: SupabaseClient,
    categoryId: string,
  ): Promise<{ count: number | null; error: Error | null }> {
    const { count, error } = await supabase
      .from("menu_items")
      .select("id", { count: "exact", head: true })
      .eq("category_id", categoryId);

    return { count, error };
  }

  async updateMenuItem(
    supabase: SupabaseClient,
    input: UpdateMenuItemInput,
  ): Promise<{ data: MenuItem | null; error: Error | null }> {
    const { data, error } = await supabase
      .from("menu_items")
      .update({
        name: input.name,
        description: input.description || null,
        price: input.price,
        category_id: input.categoryId || null,
        image_url: input.imageUrl || null,
        is_available: input.isAvailable,
      })
      .eq("id", input.menuItemId)
      .select("*")
      .single();

    return { data, error };
  }

  async updateAvailability(
    supabase: SupabaseClient,
    menuItemId: string,
    isAvailable: boolean,
  ): Promise<{ data: MenuItem | null; error: Error | null }> {
    const { data, error } = await supabase
      .from("menu_items")
      .update({
        is_available: isAvailable,
      })
      .eq("id", menuItemId)
      .select("*")
      .single();

    return { data, error };
  }
  async deleteMenuItem(
    supabase: SupabaseClient,
    menuItemId: string,
  ): Promise<{ error: Error | null }> {
    const { error } = await supabase
      .from("menu_items")
      .delete()
      .eq("id", menuItemId);

    return { error };
  }

  async uploadImage(
    supabase: SupabaseClient,
    path: string,
    file: File,
  ): Promise<{ path: string; error: Error | null }> {
    const { data, error } = await supabase.storage
      .from(MENU_ITEM_IMAGES_BUCKET)
      .upload(path, file);

    return {
      path: data?.path ?? "",
      error,
    };
  }

  getImagePublicUrl(supabase: SupabaseClient, path: string) {
    const { data } = supabase.storage
      .from(MENU_ITEM_IMAGES_BUCKET)
      .getPublicUrl(path);

    return data.publicUrl;
  }

  async removeImage(
    supabase: SupabaseClient,
    path: string,
  ): Promise<{ error: Error | null }> {
    const { error } = await supabase.storage
      .from(MENU_ITEM_IMAGES_BUCKET)
      .remove([path]);

    return { error };
  }
}

export const menuItemRepository = new MenuItemRepository();

