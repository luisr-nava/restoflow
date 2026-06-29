"use client";

import { AppDialog } from "@/src/shared/components/ui/AppDialog";
import { Button } from "@/src/shared/components/ui/Button";
import { useUiModalStore } from "@/src/shared/stores/ui-modal.store";
import { CreateTableForm } from "./create-table-form";

type CreateTableModalProps = {
  floorId: string;
  openText?: string;
};

export function CreateTableModal({
  floorId,
  openText = "Crear mesa",
}: CreateTableModalProps) {
  const openModal = useUiModalStore((state) => state.openModal);
  const closeModal = useUiModalStore((state) => state.closeModal);
  const open = useUiModalStore(
    (state) =>
      state.modals.createTable?.open === true &&
      state.modals.createTable?.payload?.floorId === floorId,
  );

  return (
    <>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={() => openModal("createTable", { floorId })}>
        {openText}
      </Button>

      <AppDialog
        open={open}
        onClose={() => closeModal("createTable")}
        title="Crear mesa"
        description="Agregá una nueva mesa al piso seleccionado."
        size="md">
        <CreateTableForm
          floorId={floorId}
          onSuccess={() => closeModal("createTable")}
        />
      </AppDialog>
    </>
  );
}
