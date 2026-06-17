import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  DashboardData,
  DashboardRecentOrder,
  DashboardSalesChartPoint,
  DashboardSummary,
  DashboardTopTable,
} from "../types/dashboard.types";

export interface IDashboardRepository {
  getDashboardData(
    supabase: SupabaseClient,
    restaurantId: string,
  ): Promise<{ data: DashboardData; error: Error | null }>;
}

class DashboardRepository implements IDashboardRepository {
  async getDashboardData(
    supabase: SupabaseClient,
    restaurantId: string,
  ): Promise<{ data: DashboardData; error: Error | null }> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const { data: paidOrders, error: paidOrdersError } = await supabase
      .from("orders")
      .select("id,total,status,table_id,created_at")
      .eq("restaurant_id", restaurantId)
      .eq("status", "PAID")
      .gte("created_at", today.toISOString());

    if (paidOrdersError) {
      return {
        data: this.getEmptyDashboardData(),
        error: paidOrdersError,
      };
    }

    const { data: activeOrders, error: activeOrdersError } = await supabase
      .from("orders")
      .select("id")
      .eq("restaurant_id", restaurantId)
      .neq("status", "PAID")
      .neq("status", "CANCELED");

    if (activeOrdersError) {
      return {
        data: this.getEmptyDashboardData(),
        error: activeOrdersError,
      };
    }

    const { data: kitchenOrders, error: kitchenOrdersError } = await supabase
      .from("orders")
      .select("id")
      .eq("restaurant_id", restaurantId)
      .in("status", ["PENDING", "ACCEPTED", "PREPARING", "READY"]);

    if (kitchenOrdersError) {
      return {
        data: this.getEmptyDashboardData(),
        error: kitchenOrdersError,
      };
    }

    const { data: tables, error: tablesError } = await supabase
      .from("restaurant_tables")
      .select("id,name,status")
      .eq("restaurant_id", restaurantId);

    if (tablesError) {
      return {
        data: this.getEmptyDashboardData(),
        error: tablesError,
      };
    }

    const { data: recentOrdersData, error: recentOrdersError } = await supabase
      .from("orders")
      .select(
        `
        id,
        total,
        status,
        created_at,
        restaurant_tables (
          name
        )
      `,
      )
      .eq("restaurant_id", restaurantId)
      .order("created_at", { ascending: false })
      .limit(5);

    if (recentOrdersError) {
      return {
        data: this.getEmptyDashboardData(),
        error: recentOrdersError,
      };
    }

    const summary: DashboardSummary = {
      todaySales: paidOrders.reduce(
        (acc, order) => acc + Number(order.total),
        0,
      ),
      activeOrders: activeOrders.length,
      occupiedTables: tables.filter((table) => table.status === "OCCUPIED")
        .length,
      availableTables: tables.filter((table) => table.status === "AVAILABLE")
        .length,
      kitchenOrders: kitchenOrders.length,
    };

    const recentOrders: DashboardRecentOrder[] = recentOrdersData.map(
      (order) => ({
        id: order.id,
        tableName: order.restaurant_tables?.[0]?.name ?? "Sin mesa",
        total: Number(order.total),
        status: order.status,
        createdAt: order.created_at,
      }),
    );

    const tableMap = new Map<string, DashboardTopTable>();

    paidOrders.forEach((order) => {
      if (!order.table_id) {
        return;
      }

      const table = tables.find((item) => item.id === order.table_id);

      if (!table) {
        return;
      }

      const current = tableMap.get(order.table_id);

      tableMap.set(order.table_id, {
        tableId: order.table_id,
        tableName: table.name,
        total: (current?.total ?? 0) + Number(order.total),
      });
    });

    const topTables = Array.from(tableMap.values())
      .sort((a, b) => b.total - a.total)
      .slice(0, 5);

    const salesChartMap = new Map<string, number>();

    for (let hour = 0; hour < 24; hour++) {
      salesChartMap.set(`${hour.toString().padStart(2, "0")}:00`, 0);
    }

    paidOrders.forEach((order) => {
      const hour = new Date(order.created_at).getHours();
      const key = `${hour.toString().padStart(2, "0")}:00`;

      salesChartMap.set(
        key,
        (salesChartMap.get(key) ?? 0) + Number(order.total),
      );
    });

    const salesChart: DashboardSalesChartPoint[] = Array.from(
      salesChartMap.entries(),
    ).map(([hour, total]) => ({
      hour,
      total,
    }));

    return {
      data: {
        summary,
        recentOrders,
        topTables,
        salesChart,
      },
      error: null,
    };
  }

  private getEmptyDashboardData(): DashboardData {
    return {
      summary: {
        todaySales: 0,
        activeOrders: 0,
        occupiedTables: 0,
        availableTables: 0,
        kitchenOrders: 0,
      },
      recentOrders: [],
      topTables: [],
      salesChart: [],
    };
  }
}

export const dashboardRepository = new DashboardRepository();


