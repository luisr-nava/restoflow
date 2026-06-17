import type { DashboardSummary } from "../types/dashboard.types";

type DashboardSummaryCardsProps = {
  summary: DashboardSummary;
};

export function DashboardSummaryCards({ summary }: DashboardSummaryCardsProps) {
  const cards = [
    {
      label: "Ventas hoy",
      value: `$${summary.todaySales.toFixed(2)}`,
    },
    {
      label: "Pedidos activos",
      value: summary.activeOrders,
    },
    {
      label: "Mesas ocupadas",
      value: summary.occupiedTables,
    },
    {
      label: "Mesas libres",
      value: summary.availableTables,
    },
    {
      label: "Pedidos en cocina",
      value: summary.kitchenOrders,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      {cards.map((card) => (
        <div
          key={card.label}
          className="rounded-xl border border-border bg-surface p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">{card.label}</p>
          <p className="mt-2 text-2xl font-semibold text-foreground">
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}
