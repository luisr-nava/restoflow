"use client";

import { useDashboardData } from "../hooks/use-dashboard-data";
import { DashboardSalesChart } from "./dashboard-sales-chart";
import { DashboardSummaryCards } from "./dashboard-summary-cards";
import { RecentOrdersTable } from "./recent-orders-table";
import { TopTablesTable } from "./top-tables-table";

export function DashboardView() {
  const { data, isLoading, isError } = useDashboardData();

  if (isLoading) {
    return (
      <div className="rounded-xl border border-border bg-surface p-6">
        <p className="text-sm text-muted-foreground">Cargando dashboard...</p>
      </div>
    );
  }

  if (isError || !data?.data) {
    return (
      <div className="rounded-xl border border-border bg-surface p-6">
        <p className="text-sm text-red-500">
          No se pudo cargar la información del dashboard.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <DashboardSummaryCards summary={data.data.summary} />

      <DashboardSalesChart data={data.data.salesChart} />

      <div className="grid gap-6 xl:grid-cols-2">
        <RecentOrdersTable orders={data.data.recentOrders} />
        <TopTablesTable tables={data.data.topTables} />
      </div>
    </div>
  );
}
