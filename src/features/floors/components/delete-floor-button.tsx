"use client";

import { useState } from "react";

import { useDeleteFloor } from "../hooks/use-delete-floor";
import type { RestaurantFloor } from "../types/floor.types";

type DeleteFloorButtonProps = {
  floor: RestaurantFloor;
  onDeleted?: () => void;
};

export function DeleteFloorButton({
  floor,
  onDeleted,
}: DeleteFloorButtonProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [forceConfirmOpen, setForceConfirmOpen] = useState(false);

  const { mutate, isPending } = useDeleteFloor();

  const handleDelete = (force: boolean) => {
    mutate(
      {
        floorId: floor.id,
        force,
      },
      {
        onSuccess: (result) => {
          if (result.requiresConfirmation) {
            setConfirmOpen(false);
            setForceConfirmOpen(true);
            return;
          }

          setConfirmOpen(false);
          setForceConfirmOpen(false);
          onDeleted?.();
        },
      },
    );
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setConfirmOpen(true)}
        className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600">
        Eliminar piso
      </button>

      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-foreground">
              Eliminar piso
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              ¿Querés eliminar el piso <strong>{floor.name}</strong>?
            </p>

            <p className="mt-2 text-xs text-muted-foreground">
              También se eliminarán todas las mesas de este piso.
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
                onClick={() => handleDelete(false)}
                className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 disabled:cursor-not-allowed disabled:opacity-40">
                {isPending ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}

      {forceConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-foreground">
              Confirmar eliminación
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Este piso tiene mesas ocupadas o reservadas.
            </p>

            <p className="mt-2 text-xs text-muted-foreground">
              Si confirmás, esas mesas pasarán a estado cerrada y después se
              eliminarán junto con el piso.
            </p>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setForceConfirmOpen(false)}
                className="rounded-lg border border-border px-3 py-2 text-sm">
                Cancelar
              </button>

              <button
                type="button"
                disabled={isPending}
                onClick={() => handleDelete(true)}
                className="rounded-lg border border-red-200 px-3 py-2 text-sm text-red-600 disabled:cursor-not-allowed disabled:opacity-40">
                {isPending ? "Eliminando..." : "Confirmar y eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

