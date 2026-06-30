"use client";

import { formatMoney } from "@/src/shared/utils/format-money";
import type { TopProduct } from "../types/report.types";
import { ReportWidgetCard } from "./report-widget-card";

type TopProductsTableProps = {
  currency?: string | null;
  products: TopProduct[];
  isLoading: boolean;
  isError: boolean;
  errorMessage?: string;
};

export function TopProductsTable({
  currency,
  products,
  isLoading,
  isError,
  errorMessage,
}: TopProductsTableProps) {
  return (
    <ReportWidgetCard
      title="Productos más vendidos"
      isLoading={isLoading}
      isError={isError}
      errorMessage={errorMessage}
      isEmpty={products.length === 0}
      loadingLabel="Cargando productos vendidos..."
      emptyTitle="Todavía no hay productos vendidos"
      emptyDescription="Cuando cierres mesas con ventas, acá vas a ver tus productos más vendidos.">
      <div className="divide-y divide-border">
        {products.map((product) => (
          <div
            key={product.name}
            className="flex items-center justify-between gap-4 p-4">
            <div>
              <h3 className="text-sm font-medium">{product.name}</h3>
              <p className="mt-1 font-mono text-xs text-muted-foreground">
                {product.quantity} vendidos
              </p>
            </div>

            <p className="font-mono text-sm font-medium">
              {formatMoney(product.total, currency)}
            </p>
          </div>
        ))}
      </div>
    </ReportWidgetCard>
  );
}
