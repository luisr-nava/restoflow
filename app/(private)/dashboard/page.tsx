import { DashboardView } from "@/src/features/dashboard/components/dashboard-view";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Resumen general del restaurante.
        </p>
      </div>

      <DashboardView />
    </div>
  );
}
