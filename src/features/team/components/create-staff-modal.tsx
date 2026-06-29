"use client";

import { AppDialog } from "@/src/shared/components/ui/AppDialog";
import { Button } from "@/src/shared/components/ui/Button";
import { useUiModalStore } from "@/src/shared/stores/ui-modal.store";
import { CreateStaffForm } from "./create-staff-form";

export function CreateStaffModal() {
  const openModal = useUiModalStore((state) => state.openModal);
  const closeModal = useUiModalStore((state) => state.closeModal);
  const open = useUiModalStore((state) => state.modals.createStaff?.open ?? false);

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="md"
        onClick={() => openModal("createStaff")}>
        Agregar personal
      </Button>

      <AppDialog
        open={open}
        onClose={() => closeModal("createStaff")}
        title={
          <>
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Equipo
            </span>
            <span className="mt-1 block text-lg font-medium text-foreground">
              Crear personal
            </span>
          </>
        }
        size="md">
        <CreateStaffForm onSuccess={() => closeModal("createStaff")} />
      </AppDialog>
    </>
  );
}
