"use client";

import { AppDialog } from "@/src/shared/components/ui/AppDialog";
import { Button } from "@/src/shared/components/ui/Button";
import { useUiModalStore } from "@/src/shared/stores/ui-modal.store";
import { CreateFloorForm } from "./create-floor-form";
import { CirclePlus } from "lucide-react";

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
      <Button
        type="button"
        variant="secondary"
        size="sm"
        leftIcon={<CirclePlus size={15}/>}
        onClick={() => openModal("createFloor")}
        >
        {openText}
      </Button>

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

