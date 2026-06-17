"use client";

import { useTopProducts } from "../hooks/use-top-products";

export function TopProductsTable() {
  const { data: products = [], isLoading } = useTopProducts();

  return (
    <div className="rounded-2xl border border-border bg-background">
      <div className="border-b border-border px-4 py-3">
        <h2 className="text-sm font-medium">Productos más vendidos</h2>
      </div>

      {isLoading ? (
        <div className="p-6 text-sm text-muted-foreground">Cargando...</div>
      ) : products.length === 0 ? (
        <div className="p-6 text-sm text-muted-foreground">
          No hay productos vendidos.
        </div>
      ) : (
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
      )}
    </div>
  );
}
