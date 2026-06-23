"use client";

import { useEffect, useState } from "react";
import { DndContext, type DragEndEvent, useDraggable } from "@dnd-kit/core";
import { EmptyState, LoadingState } from "@/src/shared/components/states";

import { FloorTablesPanel } from "./floor-tables-panel";
import { useGetTablesByFloorId } from "../hooks/use-get-tables-by-floor-id";
import { useUpdateTablePosition } from "../hooks/use-update-table-position";
import type { RestaurantTable } from "../types/table.types";

type FloorTableCanvasProps = {
  floorId: string;
};

type DraggableTableProps = {
  table: RestaurantTable;
};

function DraggableTable({ table }: DraggableTableProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: table.id,
    });

  const x = table.x + (transform?.x ?? 0);
  const y = table.y + (transform?.y ?? 0);

  return (
    <button
      ref={setNodeRef}
      type="button"
      {...listeners}
      {...attributes}
      className={`absolute flex items-center justify-center rounded-xl border border-border bg-background text-sm font-medium shadow-sm ${
        isDragging ? "z-20 cursor-grabbing opacity-80" : "z-10 cursor-grab"
      }`}
      style={{
        left: x,
        top: y,
        width: table.width,
        height: table.height,
      }}>
      <span>{table.name}</span>
    </button>
  );
}
function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}
export function FloorTableCanvas({ floorId }: FloorTableCanvasProps) {
  const { data, isLoading } = useGetTablesByFloorId({ floorId });
  const tables = data ?? [];
  const { mutate } = useUpdateTablePosition();
  const [localTables, setLocalTables] = useState<RestaurantTable[]>(tables);

  useEffect(() => {
    if (data) {
      setLocalTables(data);
    }
  }, [data]);

  const handleDragEnd = (event: DragEndEvent) => {
    const tableId = String(event.active.id);
    const table = localTables.find((item) => item.id === tableId);

    if (!table) {
      return;
    }

    const canvasWidth = event.activatorEvent.currentTarget ? 1280 : 1280;

    const canvasHeight = 520;

    const nextX = clamp(
      Math.round(table.x + event.delta.x),
      0,
      canvasWidth - table.width,
    );

    const nextY = clamp(
      Math.round(table.y + event.delta.y),
      0,
      canvasHeight - table.height,
    );

    setLocalTables((currentTables) =>
      currentTables.map((currentTable) =>
        currentTable.id === table.id
          ? {
              ...currentTable,
              x: nextX,
              y: nextY,
            }
          : currentTable,
      ),
    );

    mutate({
      tableId: table.id,
      x: nextX,
      y: nextY,
      width: table.width,
      height: table.height,
    });
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
      <div className="relative min-h-[560px] overflow-hidden rounded-2xl border border-border bg-background">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <div>
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Canvas
            </p>
            <h2 className="text-sm font-medium text-foreground">
              Distribución de mesas
            </h2>
          </div>

          <p className="font-mono text-xs text-muted-foreground">
            {localTables.length} mesas
          </p>
        </div>

        <DndContext onDragEnd={handleDragEnd}>
          <div className="relative h-[520px] bg-[linear-gradient(to_right,rgba(0,0,0,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.04)_1px,transparent_1px)] bg-[size:24px_24px]">
            {isLoading ? (
              <LoadingState
                label="Cargando mesas..."
                className="flex h-full items-center justify-center rounded-none border-0 bg-transparent text-center"
              />
            ) : localTables.length === 0 ? (
              <EmptyState
                title="Este piso todavía no tiene mesas"
                description="Creá la primera mesa para empezar a operar."
                className="flex h-full items-center justify-center rounded-none border-0 bg-transparent"
              />
            ) : (
              localTables.map((table) => (
                <DraggableTable key={table.id} table={table} />
              ))
            )}
          </div>
        </DndContext>
      </div>

      <FloorTablesPanel tables={localTables} />
    </div>
  );
}
