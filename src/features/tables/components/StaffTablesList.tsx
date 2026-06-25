"use client";

import { CloseTableModal } from "@/src/features/orders/components/close-table-modal";
import { CreateTableOrderModal } from "@/src/features/orders/components/create-table-order-modal";
import { useGetStaffOpenOrderByTableId } from "@/src/features/orders/hooks/use-get-staff-open-order-by-table-id";
import { useOrdersRealtime } from "@/src/features/orders/hooks/use-orders-realtime";
import { useGetStaffRestaurantCurrency } from "@/src/features/restaurants/hooks/use-get-staff-restaurant-currency";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/src/shared/components/states";
import { formatMoney } from "@/src/shared/utils/format-money";

import { useGetStaffTables } from "../hooks/use-get-staff-tables";
import type { RestaurantTable } from "../types/table.types";

type StaffTableCardProps = {
  table: RestaurantTable;
  currency?: string | null;
};

function StaffTableCard({ table, currency }: StaffTableCardProps) {
  const { data: openOrder, error, isError, isLoading } =
    useGetStaffOpenOrderByTableId(table.id);

  const total = openOrder?.total ?? 0;
  const hasOpenOrder = Boolean(openOrder);
  const canCloseTable = hasOpenOrder;

  return (
    <div className="rounded-2xl border border-border bg-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-medium">{table.name}</h3>

          <p className="mt-2 text-sm text-muted-foreground">
            {table.seats} lugares
          </p>

          {isError ? (
            <div className="mt-3">
              <ErrorState
                title="No se pudo cargar el consumo"
                description={error.message}
                className="rounded-xl px-4 py-3 text-left"
              />
            </div>
          ) : hasOpenOrder ? (
            <p className="mt-2 text-sm font-medium text-foreground">
              Consumo: {formatMoney(total, currency)}
            </p>
          ) : isLoading ? (
            <p className="mt-2 text-sm text-muted-foreground">Cargando consumo...</p>
          ) : null}
        </div>

        <span className="text-xs text-muted-foreground">{table.status}</span>
      </div>

      <div className="mt-4 flex justify-end gap-2">
        <CreateTableOrderModal
          tableId={table.id}
          mode="staff"
          disabled={table.status === "CLOSED"}
        />

        {canCloseTable && (
          <CloseTableModal tableId={table.id} total={total} mode="staff" />
        )}
      </div>
    </div>
  );
}

export function StaffTablesList() {
  useOrdersRealtime();

  const { data: tables = [], error, isError, isLoading } = useGetStaffTables();
  const { data: staffRestaurantCurrency } = useGetStaffRestaurantCurrency();
  const currency = staffRestaurantCurrency?.data?.currency;

  if (isLoading) {
    return <LoadingState label="Cargando tus mesas..." className="bg-surface" />;
  }

  if (isError) {
    return (
      <ErrorState
        title="No se pudieron cargar tus mesas"
        description={error.message}
        className="bg-surface"
      />
    );
  }

  if (tables.length === 0) {
    return (
      <EmptyState
        title="No tenés mesas asignadas por ahora"
        description="Cuando un owner o manager te asigne mesas, van a aparecer acá para tomar pedidos."
        className="bg-surface"
      />
    );
  }

  return (
    <div className="grid gap-3">
      {tables.map((table) => (
        <StaffTableCard key={table.id} table={table} currency={currency} />
      ))}
    </div>
  );
}
