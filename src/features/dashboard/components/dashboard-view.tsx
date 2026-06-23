"use client";

import { EmptyState, LoadingState } from "@/src/shared/components/states";
import { useDashboardData } from "../hooks/use-dashboard-data";
import { DashboardSalesChart } from "./dashboard-sales-chart";
import { DashboardSummaryCards } from "./dashboard-summary-cards";
import { RecentOrdersTable } from "./recent-orders-table";
import { TopTablesTable } from "./top-tables-table";

function DashboardLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <LoadingState label="Cargando dashboard..." className="bg-surface" />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-28 rounded-2xl border border-border bg-background"
          />
        ))}
      </div>

      <div className="h-80 rounded-2xl border border-border bg-background" />

      <div className="grid gap-6 xl:grid-cols-2">
        <div className="h-72 rounded-2xl border border-border bg-background" />
        <div className="h-72 rounded-2xl border border-border bg-background" />
      </div>
    </div>
  );
}

export function DashboardView() {
  const { data, isLoading, isError } = useDashboardData();

  if (isLoading) {
    return <DashboardLoadingSkeleton />;
  }

  if (isError || !data?.data) {
    return (
      <EmptyState
        title="No se pudo cargar el dashboard"
        description="Intentá recargar la página o revisar la conexión."
        className="bg-surface"
      />
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
