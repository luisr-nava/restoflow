"use client";

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
    <div className="flex gap-2 overflow-x-auto">
      {floors.map((floor) => {
        const active = floor.id === selectedFloorId;

        return (
          <button
            key={floor.id}
            type="button"
            onClick={() => setSelectedFloorId(floor.id)}
            className={`rounded-lg border px-3 py-2 text-sm font-medium ${
              active
                ? "border-foreground bg-foreground text-background"
                : "border-border bg-background text-muted-foreground hover:text-foreground"
            }`}>
            {floor.name}
          </button>
        );
      })}
    </div>
  );
}
