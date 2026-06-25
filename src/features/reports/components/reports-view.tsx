"use client";

import { useGetRestaurantSettings } from "@/src/features/restaurants/hooks/use-get-restaurant-settings";
import { PaymentMethodsTable } from "./payment-methods-table";
import { SalesSummaryCards } from "./sales-summary-cards";
import { TopCategoriesTable } from "./top-categories-table";
import { TopProductsTable } from "./top-products-table";

export function ReportsView() {
  const { data: restaurantSettings } = useGetRestaurantSettings();
  const currency = restaurantSettings?.data?.currency;

  return (
    <div className="space-y-6">
      <div>
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Reportes
        </p>

        <h1 className="mt-1 text-2xl font-semibold">
          Reportes del restaurante
        </h1>
      </div>

      <SalesSummaryCards currency={currency} />

      <div className="grid gap-4 xl:grid-cols-2">
        <TopProductsTable currency={currency} />
        <TopCategoriesTable currency={currency} />
      </div>

      <PaymentMethodsTable currency={currency} />
    </div>
  );
}
