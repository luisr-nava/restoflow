"use client";

import { EmptyState } from "@/src/shared/components/states";
import { Skeleton } from "@/src/shared/components/ui/Skeleton";
import { useRestaurantSettingsContext } from "@/src/features/restaurants/hooks/use-restaurant-settings-context";
import { useDashboardData } from "../hooks/use-dashboard-data";
import { DashboardSalesChart } from "./dashboard-sales-chart";
import { DashboardSummaryCards } from "./dashboard-summary-cards";
import { RecentOrdersTable } from "./recent-orders-table";
import { TodayReservationsCard } from "./today-reservations-card";
import { TopTablesTable } from "./top-tables-table";

function DashboardLoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton key={index} className="h-28 rounded-2xl" />
        ))}
      </div>

      <Skeleton className="h-80 rounded-2xl" />

      <div className="grid gap-6 xl:grid-cols-2">
        <Skeleton className="h-72 rounded-2xl" />
        <Skeleton className="h-72 rounded-2xl" />
      </div>
    </div>
  );
}

export function DashboardView() {
  const { data, isLoading, isError } = useDashboardData();
  const { restaurant } = useRestaurantSettingsContext();
  const currency = restaurant?.currency;

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
      <DashboardSummaryCards summary={data.data.summary} currency={currency} />

      <DashboardSalesChart data={data.data.salesChart} />

      <div className="grid gap-6 xl:grid-cols-3">
        <TodayReservationsCard />
        <RecentOrdersTable
          orders={data.data.recentOrders}
          currency={currency}
        />
        <TopTablesTable tables={data.data.topTables} currency={currency} />
      </div>
    </div>
  );
}
