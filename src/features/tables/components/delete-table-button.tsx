"use client";

import { AppDialog } from "@/src/shared/components/ui/AppDialog";
import { Button } from "@/src/shared/components/ui/Button";
import { useUiModalStore } from "@/src/shared/stores/ui-modal.store";
import { useDeleteTable } from "../hooks/use-delete-table";
import type { RestaurantTable } from "../types/table.types";

type DeleteTableButtonProps = {
  table: RestaurantTable;
  showTrigger?: boolean;
};

export function DeleteTableButton({
  table,
  showTrigger = true,
}: DeleteTableButtonProps) {
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
      {showTrigger && (
        <Button
          type="button"
          variant="danger"
          size="sm"
          disabled={table.status !== "AVAILABLE"}
          onClick={() => openModal("deleteTable", { tableId: table.id })}>
          Eliminar
        </Button>
      )}

      <AppDialog
        open={confirmOpen}
        onClose={() => closeModal("deleteTable")}
        title="Eliminar mesa"
        size="md"
        footer={
          <>
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() => closeModal("deleteTable")}>
              Cancelar
            </Button>

            <Button
              type="button"
              variant="danger"
              size="md"
              disabled={isPending}
              onClick={handleDelete}>
              Eliminar
            </Button>
          </>
        }>
        <p className="text-sm text-muted-foreground">
          ¿Querés eliminar la mesa <strong>{table.name}</strong>?
        </p>

        <p className="mt-2 text-xs text-muted-foreground">
          Sólo se pueden eliminar mesas en estado disponible.
        </p>
      </AppDialog>
    </>
  );
}
