"use client";

import { CreateTableOrderModal } from "@/src/features/orders/components/create-table-order-modal";
import { useGetOpenOrderByTableId } from "@/src/features/orders/hooks/use-get-open-order-by-table-id";
import { useGetRestaurantSettings } from "@/src/features/restaurants/hooks/use-get-restaurant-settings";
import { EmptyState, ErrorState } from "@/src/shared/components/states";
import {
  ActionMenu,
  ActionMenuItem,
} from "@/src/shared/components/ui/ActionMenu";
import { useUiModalStore } from "@/src/shared/stores/ui-modal.store";
import { formatMoney } from "@/src/shared/utils/format-money";

import { DeleteTableButton } from "./delete-table-button";
import { EditTableModal } from "./edit-table-modal";
import type { RestaurantTable } from "../types/table.types";
import { CloseTableModal } from "../../orders/components/close-table-modal";
type FloorTablesPanelProps = {
  tables: RestaurantTable[];
};

type FloorTableCardProps = {
  table: RestaurantTable;
  currency?: string | null;
};

const statusLabel: Record<RestaurantTable["status"], string> = {
  AVAILABLE: "Disponible",
  OCCUPIED: "Ocupada",
  RESERVED: "Reservada",
  CLOSED: "Cerrada",
};

function FloorTableCard({ table, currency }: FloorTableCardProps) {
  const { data: activeOrder, error, isError, isLoading } =
    useGetOpenOrderByTableId(table.id);
  const openModal = useUiModalStore((state) => state.openModal);

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

      <div className="mt-4 border-t border-border pt-3">
        {isError ? (
          <ErrorState
            title="No se pudo cargar el consumo"
            description={error.message}
            className="rounded-xl px-4 py-3 text-left"
          />
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Consumo
              </p>
              <p className="mt-1 text-sm font-medium">
                {isLoading
                  ? "Cargando..."
                  : formatMoney(consumption, currency)}
              </p>
            </div>

            {hasActiveOrder && (
              <CloseTableModal tableId={table.id} total={consumption} />
            )}
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap justify-end gap-2">
        <CreateTableOrderModal
          tableId={table.id}
          disabled={table.status === "CLOSED"}
        />

        <ActionMenu ariaLabel={`Acciones de ${table.name}`}>
          <ActionMenuItem
            onClick={() => openModal("editTable", { tableId: table.id })}>
            Editar
          </ActionMenuItem>

          <ActionMenuItem
            onClick={() => openModal("deleteTable", { tableId: table.id })}
            disabled={table.status !== "AVAILABLE"}
            tone="danger">
            Eliminar
          </ActionMenuItem>
        </ActionMenu>

        <EditTableModal table={table} showTrigger={false} />
        <DeleteTableButton table={table} showTrigger={false} />
      </div>
    </div>
  );
}

export function FloorTablesPanel({ tables }: FloorTablesPanelProps) {
  const { data: restaurantSettings } = useGetRestaurantSettings();
  const currency = restaurantSettings?.data?.currency;

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

      <div className="max-h-130 space-y-3 overflow-y-auto p-3">
        {tables.length === 0 ? (
          <EmptyState
            title="Sin mesas en este piso"
            description="Las mesas creadas aparecerán acá con su estado y consumo."
            className="rounded-none border-0 bg-transparent"
          />
        ) : (
          tables.map((table) => (
            <FloorTableCard key={table.id} table={table} currency={currency} />
          ))
        )}
      </div>
    </aside>
  );
}
