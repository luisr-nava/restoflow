import { formatMoney } from "@/src/shared/utils/format-money";
import { Card, CardDescription, CardTitle } from "@/src/shared/components/ui/Card";
import type { DashboardSummary } from "../types/dashboard.types";

type DashboardSummaryCardsProps = {
  summary: DashboardSummary;
  currency?: string | null;
};

export function DashboardSummaryCards({
  summary,
  currency,
}: DashboardSummaryCardsProps) {
  const cards = [
    {
      label: "Ventas hoy",
      value: formatMoney(summary.todaySales, currency),
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
        <Card
          key={card.label}
          variant="muted"
          size="md"
          className="shadow-sm">
          <CardDescription>{card.label}</CardDescription>
          <CardTitle className="mt-2 text-2xl">
            {card.value}
          </CardTitle>
        </Card>
      ))}
    </div>
  );
}
