"use client";

import { useTopCategories } from "../hooks/use-top-categories";

export function TopCategoriesTable() {
  const { data: categories = [], isLoading } = useTopCategories();

  return (
    <div className="rounded-2xl border border-border bg-background">
      <div className="border-b border-border px-4 py-3">
        <h2 className="text-sm font-medium">Categorías más vendidas</h2>
      </div>

      {isLoading ? (
        <div className="p-6 text-sm text-muted-foreground">Cargando...</div>
      ) : categories.length === 0 ? (
        <div className="p-6 text-sm text-muted-foreground">
          No hay categorías vendidas.
        </div>
      ) : (
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
      )}
    </div>
  );
}
