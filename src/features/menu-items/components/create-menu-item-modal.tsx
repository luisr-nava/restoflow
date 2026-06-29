"use client";

import { AppDialog } from "@/src/shared/components/ui/AppDialog";
import { Button } from "@/src/shared/components/ui/Button";
import { useUiModalStore } from "@/src/shared/stores/ui-modal.store";
import { CreateMenuItemForm } from "./create-menu-item-form";

type CreateMenuItemModalProps = {
  openText?: string;
  showTrigger?: boolean;
};

export function CreateMenuItemModal({
  openText = "Crear item",
  showTrigger = true,
}: CreateMenuItemModalProps) {
  const openModal = useUiModalStore((state) => state.openModal);
  const closeModal = useUiModalStore((state) => state.closeModal);
  const open = useUiModalStore(
    (state) => state.modals.createMenuItem?.open ?? false,
  );

  return (
    <>
      {showTrigger && (
        <Button
          type="button"
          variant="secondary"
          size="sm"
          onClick={() => openModal("createMenuItem")}>
          {openText}
        </Button>
      )}

      <AppDialog
        open={open}
        onClose={() => closeModal("createMenuItem")}
        title="Crear item"
        description="Agregá un producto al menú del restaurante."
        size="md">
        <CreateMenuItemForm onSuccess={() => closeModal("createMenuItem")} />
      </AppDialog>
    </>
  );
}
