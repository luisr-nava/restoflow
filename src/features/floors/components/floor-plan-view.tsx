"use client";

import { useEffect, useMemo } from "react";

import { CreateTableModal } from "@/src/features/tables/components/create-table-modal";
import { FloorTableCanvas } from "@/src/features/tables/components/floor-table-canvas";
import { useOrdersRealtime } from "@/src/features/orders/hooks/use-orders-realtime";
import { EmptyState, LoadingState } from "@/src/shared/components/states";
import { useUiSelectionStore } from "@/src/shared/stores/ui-selection.store";
import { useGetFloors } from "../hooks/use-get-floors";
import { CreateFloorModal } from "./create-floor-modal";
import { DeleteFloorButton } from "./delete-floor-button";
import { FloorTabs } from "./floor-tabs";

export function FloorPlanView() {
  useOrdersRealtime();
  const { data: floors = [], isLoading } = useGetFloors();
  const selectedFloorId = useUiSelectionStore((state) => state.selectedFloorId);
  const setSelectedFloorId = useUiSelectionStore(
    (state) => state.setSelectedFloorId,
  );
  const selectedFloor = useMemo(
    () => floors.find((floor) => floor.id === selectedFloorId) ?? null,
    [floors, selectedFloorId],
  );

  useEffect(() => {
    if (!selectedFloorId && floors.length > 0) {
      setSelectedFloorId(floors[0].id);
    }
  }, [floors, selectedFloorId, setSelectedFloorId]);

  useEffect(() => {
    if (selectedFloorId && !selectedFloor) {
      setSelectedFloorId(floors[0]?.id ?? null);
    }
  }, [floors, selectedFloor, selectedFloorId, setSelectedFloorId]);

  return (
    <section className="space-y-4">
      <div className="flex items-start justify-between gap-4">
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
        <LoadingState label="Cargando pisos..." />
      ) : (
        <FloorTabs floors={floors} />
      )}

      {selectedFloorId ? (
        <FloorTableCanvas floorId={selectedFloorId} />
      ) : (
        <EmptyState
          title="Todavía no tenés pisos"
          description="Creá un piso para empezar a organizar tus mesas."
          className="min-h-[560px] flex items-center justify-center"
        />
      )}
    </section>
  );
}

