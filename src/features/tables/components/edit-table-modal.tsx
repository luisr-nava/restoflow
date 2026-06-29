"use client";

import { AppDialog } from "@/src/shared/components/ui/AppDialog";
import { Button } from "@/src/shared/components/ui/Button";
import { useUiModalStore } from "@/src/shared/stores/ui-modal.store";
import type { RestaurantTable } from "../types/table.types";
import { EditTableForm } from "./edit-table-form";

type EditTableModalProps = {
  table: RestaurantTable;
  showTrigger?: boolean;
};

export function EditTableModal({
  table,
  showTrigger = true,
}: EditTableModalProps) {
  const openModal = useUiModalStore((state) => state.openModal);
  const closeModal = useUiModalStore((state) => state.closeModal);
  const open = useUiModalStore(
    (state) =>
      state.modals.editTable?.open === true &&
      state.modals.editTable?.payload?.tableId === table.id,
  );

  return (
    <>
      {showTrigger && (
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => openModal("editTable", { tableId: table.id })}>
          Editar
        </Button>
      )}

      <AppDialog
        open={open}
        onClose={() => closeModal("editTable")}
        title="Editar mesa"
        description="Modificá los datos de la mesa seleccionada."
        size="md">
        <EditTableForm
          table={table}
          onSuccess={() => closeModal("editTable")}
        />
      </AppDialog>
    </>
  );
}
