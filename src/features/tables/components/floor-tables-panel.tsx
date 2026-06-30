"use client";

import { CreateTableOrderModal } from "@/src/features/orders/components/create-table-order-modal";
import { useGetOpenOrdersByTableIds } from "@/src/features/orders/hooks/use-get-open-order-by-table-id";
import { useRestaurantSettingsContext } from "@/src/features/restaurants/hooks/use-restaurant-settings-context";
import { EmptyState, ErrorState } from "@/src/shared/components/states";
import { Button } from "@/src/shared/components/ui/Button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/src/shared/components/ui/Card";
import {
  ActionMenu,
  ActionMenuItem,
} from "@/src/shared/components/ui/ActionMenu";
import { useUiModalStore } from "@/src/shared/stores/ui-modal.store";
import { formatMoney } from "@/src/shared/utils/format-money";

import { DeleteTableButton } from "./delete-table-button";
import { EditTableModal } from "./edit-table-modal";
import { useUpdateTableReservationStatus } from "../hooks/use-update-table-reservation-status";
import type { RestaurantTable } from "../types/table.types";
import { CloseTableModal } from "../../orders/components/close-table-modal";
import type { Order } from "../../orders/types/order.types";
import { CalendarClock } from "lucide-react";
import { CreateFloorModal } from "../../floors/components/create-floor-modal";
import { CreateTableModal } from "./create-table-modal";
import { useUiSelectionStore } from "@/src/shared/stores/ui-selection.store";

type FloorTablesPanelProps = {
  tables: RestaurantTable[];
};

type FloorTableCardProps = {
  table: RestaurantTable;
  currency?: string | null;
  openOrder: Order | null;
  openOrdersErrorMessage?: string;
  isOpenOrdersLoading: boolean;
};

const statusLabel: Record<RestaurantTable["status"], string> = {
  AVAILABLE: "Disponible",
  OCCUPIED: "Ocupada",
  RESERVED: "Reservada",
  CLOSED: "Cerrada",
};

const statusBadgeClassName: Record<RestaurantTable["status"], string> = {
  AVAILABLE: "border-ok bg-ok-soft text-ok",
  OCCUPIED: "border-accent bg-accent-soft text-accent-ink",
  RESERVED: "border-warn bg-warn-soft text-text",
  CLOSED: "border-danger bg-danger-soft text-danger",
};

type TableReservationButtonProps = {
  table: RestaurantTable;
};

function TableReservationButton({ table }: TableReservationButtonProps) {
  const { mutate, isPending } = useUpdateTableReservationStatus();
  const isReserved = table.status === "RESERVED";
  const isDisabled =
    table.status !== "AVAILABLE" && table.status !== "RESERVED";

  return (
    <Button
      type="button"
      variant="primary"
      size="sm"
      leftIcon={<CalendarClock size={10} />}
      disabled={isDisabled || isPending}
      onClick={() =>
        mutate({
          tableId: table.id,
          floorId: table.floor_id,
          status: isReserved ? "AVAILABLE" : "RESERVED",
        })
      }>
      {isReserved ? "Liberar reserva" : "Reservar"}
    </Button>
  );
}

function FloorTableCard({
  table,
  currency,
  openOrder,
  openOrdersErrorMessage,
  isOpenOrdersLoading,
}: FloorTableCardProps) {
  const openModal = useUiModalStore((state) => state.openModal);

  const consumption = openOrder?.total ?? 0;
  const hasActiveOrder = Boolean(openOrder);

  return (
    <Card variant="default" size="sm" className="bg-white border-accent/10">
      <CardHeader className="flex-row items-start justify-between gap-3">
        <div>
          <CardTitle className="text-sm font-medium">{table.name}</CardTitle>
          <CardDescription className="text-xs">
            {table.seats} sillas
          </CardDescription>
        </div>

        <div className="grid">
          <span
            className={`rounded-full border px-2 py-1 font-mono text-[10px] uppercase ${statusBadgeClassName[table.status]}`}>
            {statusLabel[table.status]}
          </span>
          <div className="flex justify-end">
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
          </div>
        </div>
      </CardHeader>

      <CardContent className="mt-1 border-t border-border pt-3">
        {openOrdersErrorMessage ? (
          <ErrorState
            title="No se pudo cargar el consumo"
            description={openOrdersErrorMessage}
            className="rounded-xl px-4 py-3 text-left"
          />
        ) : (
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
                Consumo
              </p>
              <p className="mt-1 text-sm font-medium">
                {isOpenOrdersLoading
                  ? "Cargando..."
                  : formatMoney(consumption, currency)}
              </p>
            </div>

            {hasActiveOrder && (
              <CloseTableModal tableId={table.id} total={consumption} />
            )}
          </div>
        )}
      </CardContent>

      <CardFooter className="mt-3 flex-wrap justify-end gap-2 ">
        <TableReservationButton table={table} />

        <CreateTableOrderModal
          tableId={table.id}
          disabled={table.status === "CLOSED"}
        />

        <EditTableModal table={table} showTrigger={false} />
        <DeleteTableButton table={table} showTrigger={false} />
      </CardFooter>
    </Card>
  );
}

export function FloorTablesPanel({ tables }: FloorTablesPanelProps) {
  const { restaurant } = useRestaurantSettingsContext();
  const selectedFloorId = useUiSelectionStore((state) => state.selectedFloorId);
  const tableIds = tables.map((table) => table.id);
  const {
    data: openOrdersByTable = {},
    error: openOrdersError,
    isLoading: isOpenOrdersLoading,
  } = useGetOpenOrdersByTableIds(tableIds);
  const currency = restaurant?.currency;

  return (
    <Card as="aside" variant="default" size="lg" className="p-0 bg-white">
      <CardHeader className="border-b border-border px-4 py-3 flex! flex-row items-center justify-between">
        <p className="font-serif italic text-xs uppercase tracking-[0.18em] text-muted-foreground w-1/2">
          Mesas
        </p>
        {selectedFloorId && <CreateTableModal floorId={selectedFloorId} />}
      </CardHeader>

      <CardContent className="max-h-130 space-y-3 overflow-y-auto p-3">
        {tables.length === 0 ? (
          <EmptyState
            title="Sin mesas en este piso"
            description="Las mesas creadas aparecerán acá con su estado y consumo."
            className="rounded-none border-0 bg-transparent"
          />
        ) : (
          tables.map((table) => (
            <FloorTableCard
              key={table.id}
              table={table}
              currency={currency}
              openOrder={openOrdersByTable[table.id] ?? null}
              openOrdersErrorMessage={openOrdersError?.message}
              isOpenOrdersLoading={isOpenOrdersLoading}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
}
