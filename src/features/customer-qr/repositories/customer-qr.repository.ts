import type { SupabaseClient } from "@supabase/supabase-js";

import type { CustomerQrData } from "../types/customer-qr.types";

export interface ICustomerQrRepository {
  getCustomerQrData(
    supabase: SupabaseClient,
    qrToken: string,
  ): Promise<{ data: CustomerQrData | null; error: Error | null }>;
}

class CustomerQrRepository implements ICustomerQrRepository {
  async getCustomerQrData(
    supabase: SupabaseClient,
    qrToken: string,
  ): Promise<{ data: CustomerQrData | null; error: Error | null }> {
    const { data: table, error: tableError } = await supabase
      .from("restaurant_tables")
      .select("*")
      .eq("qr_token", qrToken)
      .maybeSingle();

    if (tableError || !table) {
      return {
        data: null,
        error: tableError ?? new Error("Mesa no encontrada"),
      };
    }

    const { data: restaurant, error: restaurantError } = await supabase
      .from("restaurants")
      .select("*")
      .eq("id", table.restaurant_id)
      .maybeSingle();

    if (restaurantError || !restaurant) {
      return {
        data: null,
        error: restaurantError ?? new Error("Restaurante no encontrado"),
      };
    }

    const { data: waiter, error: waiterError } = table.waiter_id
      ? await supabase
          .from("restaurant_staff")
          .select("*")
          .eq("id", table.waiter_id)
          .eq("role", "WAITER")
          .eq("is_active", true)
          .maybeSingle()
      : { data: null, error: null };

    if (waiterError) {
      return {
        data: null,
        error: waiterError,
      };
    }

    const { data: menuItems, error: menuItemsError } = await supabase
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
      .eq("restaurant_id", table.restaurant_id)
      .eq("is_available", true)
      .order("name", { ascending: true });

    if (menuItemsError) {
      return {
        data: null,
        error: menuItemsError,
      };
    }

    return {
      data: {
        table,
        restaurant,
        waiter,
        menuItems: (menuItems ?? []).filter(
          (item) => item.menu_categories?.is_active !== false,
        ),
      },
      error: null,
    };
  }
}

export const customerQrRepository = new CustomerQrRepository();
