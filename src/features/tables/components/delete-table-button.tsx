"use client";

import { useUiModalStore } from "@/src/shared/stores/ui-modal.store";
import { useDeleteTable } from "../hooks/use-delete-table";
import type { RestaurantTable } from "../types/table.types";

type DeleteTableButtonProps = {
  table: RestaurantTable;
};

export function DeleteTableButton({ table }: DeleteTableButtonProps) {
  const openModal = useUiModalStore((state) => state.openModal);
  const closeModal = useUiModalStore((state) => state.closeModal);
  const confirmOpen = useUiModalStore(
    (state) =>
      state.modals.deleteTable?.open === true &&
      state.modals.deleteTable?.payload?.tableId === table.id,
  );
  const { mutate, isPending } = useDeleteTable();

  const handleDelete = () => {
    mutate(
      {
        tableId: table.id,
        floorId: table.floor_id,
      },
      {
      onSuccess: () => {
        closeModal("deleteTable");
      },
      },
    );
  };

  return (
    <>
      <button
        type="button"
        disabled={table.status !== "AVAILABLE"}
        onClick={() => openModal("deleteTable", { tableId: table.id })}
        className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 disabled:cursor-not-allowed disabled:opacity-40">
        Eliminar
      </button>

      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-xl">
            <h2 className="text-lg font-semibold">Eliminar mesa</h2>

            <p className="mt-2 text-sm text-muted-foreground">
              ¿Querés eliminar la mesa <strong>{table.name}</strong>?
            </p>

            <p className="mt-2 text-xs text-muted-foreground">
              Sólo se pueden eliminar mesas en estado disponible.
            </p>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => closeModal("deleteTable")}
                className="rounded-lg border border-border px-3 py-2 text-sm">
                Cancelar
              </button>

              <button
                type="button"
                disabled={isPending}
                onClick={handleDelete}
                className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600">
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
