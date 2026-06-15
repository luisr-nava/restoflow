"use client";

import type { RestaurantFloor } from "../types/floor.types";

type FloorTabsProps = {
  floors: RestaurantFloor[];
  selectedFloorId: string | null;
  onSelectFloor: (floorId: string) => void;
};

export function FloorTabs({
  floors,
  selectedFloorId,
  onSelectFloor,
}: FloorTabsProps) {
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
            onClick={() => onSelectFloor(floor.id)}
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
