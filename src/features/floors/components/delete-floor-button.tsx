"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

import { AppDialog } from "@/src/shared/components/ui/AppDialog";
import { Button } from "@/src/shared/components/ui/Button";
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
      <Button
        type="button"
        variant="danger"
        size="sm"
        onClick={() => setConfirmOpen(true)}
        className="cursor-pointer bg-red-200 text-red-800 hover:bg-red-200"
        leftIcon={<Trash2 size={15} />}>
        Eliminar piso
      </Button>

      <AppDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Eliminar piso"
        size="md"
        footer={
          <>
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setConfirmOpen(false)}>
              Cancelar
            </Button>

            <Button
              type="button"
              variant="danger"
              size="md"
              disabled={isPending}
              onClick={() => handleDelete(false)}>
              {isPending ? "Eliminando..." : "Eliminar"}
            </Button>
          </>
        }>
        <p className="text-sm text-muted-foreground">
          ¿Querés eliminar el piso <strong>{floor.name}</strong>?
        </p>

        <p className="mt-2 text-xs text-muted-foreground">
          También se eliminarán todas las mesas de este piso.
        </p>
      </AppDialog>

      <AppDialog
        open={forceConfirmOpen}
        onClose={() => setForceConfirmOpen(false)}
        title="Confirmar eliminación"
        size="md"
        footer={
          <>
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => setForceConfirmOpen(false)}>
              Cancelar
            </Button>

            <Button
              type="button"
              variant="danger"
              size="md"
              disabled={isPending}
              onClick={() => handleDelete(true)}>
              {isPending ? "Eliminando..." : "Confirmar y eliminar"}
            </Button>
          </>
        }>
        <p className="text-sm text-muted-foreground">
          Este piso tiene mesas ocupadas o reservadas.
        </p>

        <p className="mt-2 text-xs text-muted-foreground">
          Si confirmás, esas mesas pasarán a estado cerrada y después se
          eliminarán junto con el piso.
        </p>
      </AppDialog>
    </>
  );
}
