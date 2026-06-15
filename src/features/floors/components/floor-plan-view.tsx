"use client";

import { useEffect, useMemo, useState } from "react";

import { CreateTableModal } from "@/src/features/tables/components/create-table-modal";
import { FloorTableCanvas } from "@/src/features/tables/components/floor-table-canvas";

import { useGetFloors } from "../hooks/use-get-floors";
import { CreateFloorModal } from "./create-floor-modal";
import { DeleteFloorButton } from "./delete-floor-button";
import { FloorTabs } from "./floor-tabs";

export function FloorPlanView() {
  const { data: floors = [], isLoading } = useGetFloors();
  const [selectedFloorId, setSelectedFloorId] = useState<string | null>(null);

  const selectedFloor = useMemo(
    () => floors.find((floor) => floor.id === selectedFloorId) ?? null,
    [floors, selectedFloorId],
  );

  useEffect(() => {
    if (!selectedFloorId && floors.length > 0) {
      setSelectedFloorId(floors[0].id);
    }
  }, [floors, selectedFloorId]);

  useEffect(() => {
    if (selectedFloorId && !selectedFloor) {
      setSelectedFloorId(floors[0]?.id ?? null);
    }
  }, [floors, selectedFloor, selectedFloorId]);

  return (
    <section className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Floor plan
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Mesas y pisos
          </h1>
        </div>

        <div className="flex items-center gap-2">
          {selectedFloorId && <CreateTableModal floorId={selectedFloorId} />}
          {selectedFloor && (
            <DeleteFloorButton
              floor={selectedFloor}
              onDeleted={() => setSelectedFloorId(null)}
            />
          )}
          <CreateFloorModal />
        </div>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Cargando pisos...</p>
      ) : (
        <FloorTabs
          floors={floors}
          selectedFloorId={selectedFloorId}
          onSelectFloor={setSelectedFloorId}
        />
      )}

      {selectedFloorId ? (
        <FloorTableCanvas floorId={selectedFloorId} />
      ) : (
        <div className="flex min-h-[560px] items-center justify-center rounded-2xl border border-border bg-background text-sm text-muted-foreground">
          Creá un piso para comenzar a organizar las mesas.
        </div>
      )}
    </section>
  );
}
