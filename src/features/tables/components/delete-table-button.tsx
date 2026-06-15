"use client";

import { useState } from "react";

import { useDeleteTable } from "../hooks/use-delete-table";
import type { RestaurantTable } from "../types/table.types";

type DeleteTableButtonProps = {
  table: RestaurantTable;
};

export function DeleteTableButton({ table }: DeleteTableButtonProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const { mutate, isPending } = useDeleteTable();

  const handleDelete = () => {
    mutate(table.id, {
      onSuccess: () => {
        setConfirmOpen(false);
      },
    });
  };

  return (
    <>
      <button
        type="button"
        disabled={table.status !== "AVAILABLE"}
        onClick={() => setConfirmOpen(true)}
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
                onClick={() => setConfirmOpen(false)}
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
