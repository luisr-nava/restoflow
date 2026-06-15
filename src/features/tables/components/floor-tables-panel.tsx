"use client";

import { CreateTableOrderModal } from "@/src/features/orders/components/create-table-order-modal";
import { useGetActiveOrderByTableId } from "@/src/features/orders/hooks/use-get-active-order-by-table-id";

import { DeleteTableButton } from "./delete-table-button";
import { EditTableModal } from "./edit-table-modal";
import type { RestaurantTable } from "../types/table.types";
import { CloseTableModal } from "../../orders/components/close-table-modal";

type FloorTablesPanelProps = {
  tables: RestaurantTable[];
};

type FloorTableCardProps = {
  table: RestaurantTable;
};

const statusLabel: Record<RestaurantTable["status"], string> = {
  AVAILABLE: "Disponible",
  OCCUPIED: "Ocupada",
  RESERVED: "Reservada",
  CLOSED: "Cerrada",
};

function FloorTableCard({ table }: FloorTableCardProps) {
  const { data: activeOrder } = useGetActiveOrderByTableId(table.id);

  const consumption = activeOrder?.total ?? 0;
  const hasActiveOrder = Boolean(activeOrder);

  return (
    <div className="rounded-xl border border-border bg-background p-3">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-medium text-foreground">{table.name}</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {table.seats} sillas
          </p>
        </div>

        <span className="rounded-full border border-border px-2 py-1 font-mono text-[10px] uppercase text-muted-foreground">
          {statusLabel[table.status]}
        </span>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
            Consumo
          </p>
          <p className="mt-1 text-sm font-medium">${consumption}</p>
        </div>

        {hasActiveOrder && (
          <CloseTableModal tableId={table.id} total={consumption} />
        )}
      </div>

      <div className="mt-3 flex flex-wrap justify-end gap-2">
        <CreateTableOrderModal
          tableId={table.id}
          disabled={table.status === "CLOSED"}
        />

        <EditTableModal table={table} />
        <DeleteTableButton table={table} />
      </div>
    </div>
  );
}

export function FloorTablesPanel({ tables }: FloorTablesPanelProps) {
  return (
    <aside className="rounded-2xl border border-border bg-background">
      <div className="border-b border-border px-4 py-3">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
          Mesas
        </p>
        <h2 className="mt-1 text-sm font-medium text-foreground">
          Estado del piso
        </h2>
      </div>

      <div className="max-h-[520px] space-y-3 overflow-y-auto p-3">
        {tables.length === 0 ? (
          <p className="px-1 py-6 text-center text-sm text-muted-foreground">
            No hay mesas creadas.
          </p>
        ) : (
          tables.map((table) => <FloorTableCard key={table.id} table={table} />)
        )}
      </div>
    </aside>
  );
}

