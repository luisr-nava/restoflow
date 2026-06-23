"use client";

import { useTopCategories } from "../hooks/use-top-categories";
import { ReportWidgetCard } from "./report-widget-card";

export function TopCategoriesTable() {
  const { data: categories = [], isLoading } = useTopCategories();

  return (
    <ReportWidgetCard
      title="Categorías más vendidas"
      isLoading={isLoading}
      isEmpty={categories.length === 0}
      loadingLabel="Cargando categorías vendidas..."
      emptyTitle="Todavía no hay categorías vendidas"
      emptyDescription="Cuando cierres mesas con ventas, acá vas a ver qué categorías facturan más.">
      <div className="divide-y divide-border">
        {categories.map((category) => (
          <div
            key={category.name}
            className="flex items-center justify-between gap-4 p-4">
            <div>
              <h3 className="text-sm font-medium">{category.name}</h3>

              <p className="mt-1 font-mono text-xs text-muted-foreground">
                {category.quantity} vendidos
              </p>
            </div>

            <p className="font-mono text-sm font-medium">${category.total}</p>
          </div>
        ))}
      </div>
    </ReportWidgetCard>
  );
}
