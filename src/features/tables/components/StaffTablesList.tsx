"use client";

import { CreateTableOrderModal } from "../../orders/components/create-table-order-modal";
import { useGetStaffTables } from "../hooks/use-get-staff-tables";
export function StaffTablesList() {
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
        <div
          key={table.id}
          className="rounded-2xl border border-border bg-surface p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="font-medium">{table.name}</h3>

              <p className="mt-2 text-sm text-muted-foreground">
                {table.seats} lugares
              </p>
            </div>

            <span className="text-xs text-muted-foreground">
              {table.status}
            </span>
          </div>

          <div className="mt-4 flex justify-end">
            <CreateTableOrderModal
              tableId={table.id}
              mode="staff"
              disabled={table.status === "CLOSED"}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

