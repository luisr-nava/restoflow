"use client";

import { useTopProducts } from "../hooks/use-top-products";
import { ReportWidgetCard } from "./report-widget-card";

export function TopProductsTable() {
  const { data: products = [], isLoading } = useTopProducts();

  return (
    <ReportWidgetCard
      title="Productos más vendidos"
      isLoading={isLoading}
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

            <p className="font-mono text-sm font-medium">${product.total}</p>
          </div>
        ))}
      </div>
    </ReportWidgetCard>
  );
}
