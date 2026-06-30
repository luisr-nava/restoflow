"use client";

import { useRestaurantSettingsContext } from "@/src/features/restaurants/hooks/use-restaurant-settings-context";
import { useReportsOverview } from "../hooks/use-reports-overview";
import { PaymentMethodsTable } from "./payment-methods-table";
import { SalesSummaryCards } from "./sales-summary-cards";
import { TopCategoriesTable } from "./top-categories-table";
import { TopProductsTable } from "./top-products-table";

export function ReportsView() {
  const { restaurant } = useRestaurantSettingsContext();
  const { data, error, isError, isLoading } = useReportsOverview();
  const currency = restaurant?.currency;

  return (
    <div className="space-y-6">
      <SalesSummaryCards
        currency={currency}
        data={data?.salesSummary}
        isLoading={isLoading}
        isError={isError}
        errorMessage={error?.message}
      />

      <div className="grid gap-4 xl:grid-cols-2">
        <TopProductsTable
          currency={currency}
          products={data?.topProducts ?? []}
          isLoading={isLoading}
          isError={isError}
          errorMessage={error?.message}
        />
        <TopCategoriesTable
          currency={currency}
          categories={data?.topCategories ?? []}
          isLoading={isLoading}
          isError={isError}
          errorMessage={error?.message}
        />
      </div>

      <PaymentMethodsTable
        currency={currency}
        methods={data?.paymentMethods ?? []}
        isLoading={isLoading}
        isError={isError}
        errorMessage={error?.message}
      />
    </div>
  );
}
