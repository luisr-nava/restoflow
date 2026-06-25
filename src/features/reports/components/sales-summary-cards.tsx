"use client";

import { EmptyState, ErrorState } from "@/src/shared/components/states";
import { formatMoney } from "@/src/shared/utils/format-money";
import { useSalesSummary } from "../hooks/use-sales-summary";

type SalesSummaryCardsProps = {
  currency?: string | null;
};

export function SalesSummaryCards({ currency }: SalesSummaryCardsProps) {
  const { data, error, isError, isLoading } = useSalesSummary();

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="h-28 rounded-2xl border border-border bg-background"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="No se pudo cargar el resumen de ventas"
        description={error.message}
      />
    );
  }

  if (!data) {
    return (
      <EmptyState
        title="Todavía no hay resumen de ventas"
        description="Cuando cierres mesas, acá vas a ver el resumen general de ventas."
      />
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <div className="rounded-2xl border border-border bg-background p-4">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
          Ventas Totales
        </p>

        <p className="mt-3 text-2xl font-semibold">
          {formatMoney(data.totalSales, currency)}
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-background p-4">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
          Pedidos
        </p>

        <p className="mt-3 text-2xl font-semibold">{data.totalOrders}</p>
      </div>

      <div className="rounded-2xl border border-border bg-background p-4">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
          Ticket Promedio
        </p>

        <p className="mt-3 text-2xl font-semibold">
          {formatMoney(Math.round(data.averageTicket), currency)}
        </p>
      </div>

      <div className="rounded-2xl border border-border bg-background p-4">
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-muted-foreground">
          Pedidos Pagados
        </p>

        <p className="mt-3 text-2xl font-semibold">{data.paidOrders}</p>
      </div>
    </div>
  );
}
