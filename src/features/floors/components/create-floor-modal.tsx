"use client";

import { AppDialog } from "@/src/shared/components/ui/AppDialog";
import { useUiModalStore } from "@/src/shared/stores/ui-modal.store";
import { CreateFloorForm } from "./create-floor-form";

type CreateFloorModalProps = {
  openText?: string;
};

export function CreateFloorModal({
  openText = "Crear piso",
}: CreateFloorModalProps) {
  const openModal = useUiModalStore((state) => state.openModal);
  const closeModal = useUiModalStore((state) => state.closeModal);
  const open = useUiModalStore((state) => state.modals.createFloor?.open ?? false);

  return (
    <>
      <button
        type="button"
        onClick={() => openModal("createFloor")}
        className="rounded-lg border border-border bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-muted">
        {openText}
      </button>

      <AppDialog
        open={open}
        onClose={() => closeModal("createFloor")}
        title="Crear piso"
        description="Agregá un nuevo sector para organizar las mesas."
        size="md">
        <CreateFloorForm onSuccess={() => closeModal("createFloor")} />
      </AppDialog>
    </>
  );
}
