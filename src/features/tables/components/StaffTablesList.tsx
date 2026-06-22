"use client";

import { CloseTableModal } from "@/src/features/orders/components/close-table-modal";
import { CreateTableOrderModal } from "@/src/features/orders/components/create-table-order-modal";
import { useGetStaffOpenOrderByTableId } from "@/src/features/orders/hooks/use-get-staff-open-order-by-table-id";
import { useOrdersRealtime } from "@/src/features/orders/hooks/use-orders-realtime";

import { useGetStaffTables } from "../hooks/use-get-staff-tables";
import type { RestaurantTable } from "../types/table.types";

function StaffTableCard({ table }: { table: RestaurantTable }) {
  const { data: openOrder } = useGetStaffOpenOrderByTableId(table.id);

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

          {hasOpenOrder && (
            <p className="mt-2 text-sm font-medium text-foreground">
              Consumo: ${total}
            </p>
          )}
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
      <p className="mt-2 text-xs text-muted-foreground">
        Debug: openOrder={String(hasOpenOrder)} status={table.status}
      </p>
    </div>
  );
}

export function StaffTablesList() {
  useOrdersRealtime();

  const { data: tables = [], isLoading } = useGetStaffTables();

  if (isLoading) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-6 text-sm text-muted-foreground">
        Cargando mesas...
      </div>
    );
  }

  if (tables.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-6 text-sm text-muted-foreground">
        No hay mesas disponibles.
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {tables.map((table) => (
        <StaffTableCard key={table.id} table={table} />
      ))}
    </div>
  );
}
