"use client";

import { Select } from "@/src/shared/components/ui/Select";
import { useUiSelectionStore } from "@/src/shared/stores/ui-selection.store";
import type { RestaurantFloor } from "../types/floor.types";

type FloorTabsProps = {
  floors: RestaurantFloor[];
};

export function FloorTabs({ floors }: FloorTabsProps) {
  const selectedFloorId = useUiSelectionStore((state) => state.selectedFloorId);
  const setSelectedFloorId = useUiSelectionStore(
    (state) => state.setSelectedFloorId,
  );

  if (floors.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Todavía no hay pisos creados.
      </p>
    );
  }

  return (
    <div className="w-full max-w-xs">
      <Select
        aria-label="Seleccionar piso"
        value={selectedFloorId ?? ""}
        onChange={(event) => {
          const nextFloorId = event.target.value;

          setSelectedFloorId(nextFloorId || null);
        }}>
        <option value="" disabled>
          Seleccionar piso
        </option>
        {floors.map((floor) => (
          <option key={floor.id} value={floor.id}>
            {floor.name}
          </option>
        ))}
      </Select>
    </div>
  );
}
