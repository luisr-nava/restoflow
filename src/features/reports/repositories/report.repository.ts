import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  PaymentMethodReport,
  SalesSummary,
  TopCategory,
  TopProduct,
} from "../types/report.types";

export interface IReportRepository {
  getSalesSummary(
    supabase: SupabaseClient,
    restaurantId: string,
  ): Promise<{ data: SalesSummary; error: Error | null }>;

  getTopProducts(
    supabase: SupabaseClient,
    restaurantId: string,
  ): Promise<{ data: TopProduct[]; error: Error | null }>;

  getTopCategories(
    supabase: SupabaseClient,
    restaurantId: string,
  ): Promise<{ data: TopCategory[]; error: Error | null }>;

  getPaymentMethods(
    supabase: SupabaseClient,
    restaurantId: string,
  ): Promise<{ data: PaymentMethodReport[]; error: Error | null }>;
}

class ReportRepository implements IReportRepository {
  async getSalesSummary(
    supabase: SupabaseClient,
    restaurantId: string,
  ): Promise<{ data: SalesSummary; error: Error | null }> {
    const { data: orders, error } = await supabase
      .from("orders")
      .select("total")
      .eq("restaurant_id", restaurantId)
      .eq("status", "PAID");

    if (error) {
      return {
        data: {
          totalSales: 0,
          totalOrders: 0,
          averageTicket: 0,
          closedTables: 0,
        },
        error,
      };
    }

    const totalOrders = orders.length;
    const totalSales = orders.reduce(
      (acc, order) => acc + Number(order.total),
      0,
    );

    return {
      data: {
        totalSales,
        totalOrders,
        averageTicket: totalOrders > 0 ? totalSales / totalOrders : 0,
        closedTables: totalOrders,
      },
      error: null,
    };
  }

  async getTopProducts(
    supabase: SupabaseClient,
    restaurantId: string,
  ): Promise<{ data: TopProduct[]; error: Error | null }> {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
        id,
        order_items (
          name,
          quantity,
          total
        )
      `,
      )
      .eq("restaurant_id", restaurantId)
      .eq("status", "PAID");

    if (error) {
      return { data: [], error };
    }

    const productMap = new Map<string, TopProduct>();

    data.forEach((order) => {
      order.order_items.forEach((item) => {
        const current = productMap.get(item.name);

        productMap.set(item.name, {
          name: item.name,
          quantity: (current?.quantity ?? 0) + Number(item.quantity),
          total: (current?.total ?? 0) + Number(item.total),
        });
      });
    });

    return {
      data: Array.from(productMap.values()).sort((a, b) => b.total - a.total),
      error: null,
    };
  }

  async getTopCategories(
    supabase: SupabaseClient,
    restaurantId: string,
  ): Promise<{ data: TopCategory[]; error: Error | null }> {
    const { data, error } = await supabase
      .from("orders")
      .select(
        `
      id,
      order_items (
        quantity,
        total,
        menu_items (
          menu_categories (
            name
          )
        )
      )
    `,
      )
      .eq("restaurant_id", restaurantId)
      .eq("status", "PAID");

    if (error) {
      return { data: [], error };
    }

    const categoryMap = new Map<string, TopCategory>();

    data.forEach((order) => {
      order.order_items.forEach((orderItem) => {
        const categoryName =
          orderItem.menu_items?.[0]?.menu_categories?.[0]?.name ??
          "Sin categoría";

        const current = categoryMap.get(categoryName);

        categoryMap.set(categoryName, {
          name: categoryName,
          quantity: (current?.quantity ?? 0) + Number(orderItem.quantity),
          total: (current?.total ?? 0) + Number(orderItem.total),
        });
      });
    });

    return {
      data: Array.from(categoryMap.values()).sort((a, b) => b.total - a.total),
      error: null,
    };
  }

  async getPaymentMethods(
    supabase: SupabaseClient,
    restaurantId: string,
  ): Promise<{ data: PaymentMethodReport[]; error: Error | null }> {
    const { data, error } = await supabase
      .from("payments")
      .select("method,amount")
      .eq("restaurant_id", restaurantId);

    if (error) {
      return { data: [], error };
    }

    const paymentMap = new Map<PaymentMethodReport["method"], number>();

    data.forEach((payment) => {
      const current = paymentMap.get(payment.method) ?? 0;
      paymentMap.set(payment.method, current + Number(payment.amount));
    });

    return {
      data: Array.from(paymentMap.entries()).map(([method, total]) => ({
        method,
        total,
      })),
      error: null,
    };
  }
}

export const reportRepository = new ReportRepository();
