// import { DashboardKpiCard } from "@/src/features/dashboard/components/dashboard-kpi-card";
// import { RevenueCurve } from "@/src/features/dashboard/components/revenue-curve";
// import { LiveActivity } from "@/src/features/dashboard/components/live-activity";
// import { TopItemsTable } from "@/src/features/dashboard/components/top-items-table";
// import { KitchenPerformance } from "@/src/features/dashboard/components/kitchen-performance";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DashboardKpiCard
          label="Revenue · Today"
          value="$4.454"
          helper="↑ 12% vs last Thursday"
          variant="success"
        />

        <DashboardKpiCard
          label="Covers"
          value="87"
          helper="↑ 8 on forecast"
          variant="success"
        />

        <DashboardKpiCard label="Active tickets" value="2" helper="1 at pass" />

        <DashboardKpiCard
          label="Avg ticket time"
          value="14m"
          helper="↑ 1m vs target (13m)"
          variant="danger"
        />
      </section> */}

      {/* <section className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <RevenueCurve />
        <LiveActivity />
      </section> */}

      {/* <section className="grid gap-4 xl:grid-cols-[2fr_1fr]">
        <TopItemsTable />
        <KitchenPerformance />
      </section> */}
    </div>
  );
}

