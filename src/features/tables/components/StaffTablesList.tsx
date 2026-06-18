"use client";

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
        <button
          key={table.id}
          type="button"
          className="rounded-2xl border border-border bg-surface p-4 text-left transition hover:border-primary">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">{table.name}</h3>

            <span className="text-xs text-muted-foreground">
              {table.status}
            </span>
          </div>

          <p className="mt-2 text-sm text-muted-foreground">
            {table.seats} lugares
          </p>
        </button>
      ))}
    </div>
  );
}
