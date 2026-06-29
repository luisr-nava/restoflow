"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { QRCodeSVG } from "qrcode.react";

import { useGetFloors } from "@/src/features/floors/hooks/use-get-floors";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/src/shared/components/states";

import { useGetTablesByFloorId } from "../hooks/use-get-tables-by-floor-id";
import type { TableQrPdfItem } from "../types/table-qr.types";
import type { RestaurantTable } from "../types/table.types";
import { createTableQrImage } from "../utils/create-table-qr-image";
import { ExportTableQrPdfButton } from "./export-table-qr-pdf-button";

type TableQrItemProps = {
  table: RestaurantTable;
  floorName: string;
  checked: boolean;
  onCheckedChange: (tableId: string, checked: boolean) => void;
  onQrReady: (item: TableQrPdfItem) => void;
};

function TableQrItem({
  table,
  floorName,
  checked,
  onCheckedChange,
  onQrReady,
}: TableQrItemProps) {
  const qrUrl =
    typeof window === "undefined"
      ? ""
      : `${window.location.origin}/qr/${table.qr_token}`;

  useEffect(() => {
    async function createQr() {
      if (!qrUrl) {
        return;
      }

      const qrImage = await createTableQrImage(qrUrl);

      onQrReady({
        tableId: table.id,
        tableName: table.name,
        floorName,
        qrToken: table.qr_token,
        qrUrl,
        qrImage,
      });
    }

    createQr();
  }, [floorName, onQrReady, qrUrl, table.id, table.name, table.qr_token]);

  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <label className="mb-4 flex cursor-pointer items-center gap-2 text-sm text-foreground">
        <input
          type="checkbox"
          checked={checked}
          onChange={(event) => onCheckedChange(table.id, event.target.checked)}
          className="size-4 cursor-pointer accent-current"
        />
        Imprimir este QR
      </label>

      <div className="mb-4 text-center">
        <p className="text-lg font-semibold text-foreground">{table.name}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {floorName} · Escaneá para ver el menú
        </p>
      </div>

      <div className="flex justify-center rounded-lg bg-white p-4">
        <QRCodeSVG value={qrUrl} size={180} />
      </div>

      <p className="mt-3 break-all text-center text-[11px] text-muted-foreground">
        {qrUrl}
      </p>
    </div>
  );
}

function FloorQrSection({
  floorId,
  floorName,
  selectedTableIds,
  onCheckedChange,
  onQrReady,
}: {
  floorId: string;
  floorName: string;
  selectedTableIds: string[];
  onCheckedChange: (tableId: string, checked: boolean) => void;
  onQrReady: (item: TableQrPdfItem) => void;
}) {
  const { data, error, isError, isLoading } = useGetTablesByFloorId({
    floorId,
  });
  const tables = data ?? [];

  if (isLoading) {
    return (
      <LoadingState
        label={`Cargando mesas de ${floorName}...`}
        className="bg-surface"
      />
    );
  }

  if (isError) {
    return (
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">{floorName}</h2>

        <ErrorState
          title="No se pudieron cargar las mesas de este piso"
          description={error.message}
          className="bg-surface"
        />
      </section>
    );
  }

  if (tables.length === 0) {
    return (
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">{floorName}</h2>

        <EmptyState
          title="Este piso no tiene mesas"
          description="Cuando crees mesas en este piso, vas a poder generar sus códigos QR."
          className="bg-surface"
        />
      </section>
    );
  }

  return (
    <section className="space-y-4">
      <h2 className="text-lg font-semibold text-foreground">{floorName}</h2>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {tables.map((table) => (
          <TableQrItem
            key={table.id}
            table={table}
            floorName={floorName}
            checked={selectedTableIds.includes(table.id)}
            onCheckedChange={onCheckedChange}
            onQrReady={onQrReady}
          />
        ))}
      </div>
    </section>
  );
}

export function TablesQrView() {
  const { data, isLoading } = useGetFloors();
  const floors = data ?? [];

  const [pdfItems, setPdfItems] = useState<TableQrPdfItem[]>([]);
  const [selectedTableIds, setSelectedTableIds] = useState<string[]>([]);

  const selectedPdfItems = useMemo(
    () => pdfItems.filter((item) => selectedTableIds.includes(item.tableId)),
    [pdfItems, selectedTableIds],
  );

  const handleQrReady = useCallback((item: TableQrPdfItem) => {
    setPdfItems((current) => {
      const exists = current.some(
        (currentItem) => currentItem.tableId === item.tableId,
      );

      if (exists) {
        return current.map((currentItem) =>
          currentItem.tableId === item.tableId ? item : currentItem,
        );
      }

      return [...current, item];
    });

    setSelectedTableIds((current) => {
      if (current.includes(item.tableId)) {
        return current;
      }

      return [...current, item.tableId];
    });
  }, []);

  function handleCheckedChange(tableId: string, checked: boolean) {
    setSelectedTableIds((current) => {
      if (checked) {
        if (current.includes(tableId)) {
          return current;
        }

        return [...current, tableId];
      }

      return current.filter((currentTableId) => currentTableId !== tableId);
    });
  }

  function handleSelectAll() {
    setSelectedTableIds(pdfItems.map((item) => item.tableId));
  }

  function handleClearSelection() {
    setSelectedTableIds([]);
  }

  if (isLoading) {
    return <LoadingState label="Cargando QRs..." className="bg-surface" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleSelectAll}
            className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-surface-2">
            Seleccionar todos
          </button>

          <button
            type="button"
            onClick={handleClearSelection}
            className="rounded-lg border border-border px-4 py-2.5 text-sm font-medium text-foreground transition hover:bg-surface-2">
            Limpiar
          </button>

          <ExportTableQrPdfButton items={selectedPdfItems} />
        </div>
      </div>

      {floors.length === 0 ? (
        <EmptyState
          title="Todavía no hay pisos ni mesas para generar QR"
          description="Primero creá pisos y mesas en la sección Mesas."
          className="bg-surface"
        />
      ) : (
        <>
          <div className="rounded-xl border border-border bg-surface px-4 py-3">
            <p className="text-sm text-muted-foreground">
              Seleccionados:{" "}
              <span className="font-medium text-foreground">
                {selectedPdfItems.length}
              </span>
            </p>
          </div>

          <div className="space-y-8">
            {floors.map((floor) => (
              <FloorQrSection
                key={floor.id}
                floorId={floor.id}
                floorName={floor.name}
                selectedTableIds={selectedTableIds}
                onCheckedChange={handleCheckedChange}
                onQrReady={handleQrReady}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

