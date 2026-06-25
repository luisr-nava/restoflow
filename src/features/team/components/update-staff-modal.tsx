"use client";

import { AppDialog } from "@/src/shared/components/ui/AppDialog";
import { useUiModalStore } from "@/src/shared/stores/ui-modal.store";
import type { RestaurantStaff } from "../types/team.types";
import { UpdateStaffForm } from "./update-staff-form";

type UpdateStaffModalProps = {
  staff: RestaurantStaff;
  showTrigger?: boolean;
};

export function UpdateStaffModal({
  staff,
  showTrigger = true,
}: UpdateStaffModalProps) {
  const openModal = useUiModalStore((state) => state.openModal);
  const closeModal = useUiModalStore((state) => state.closeModal);
  const open = useUiModalStore(
    (state) =>
      state.modals.editStaff?.open === true &&
      state.modals.editStaff?.payload?.staffId === staff.id,
  );

  return (
    <>
      {showTrigger && (
        <button
          type="button"
          onClick={() => openModal("editStaff", { staffId: staff.id })}
          className="rounded-lg border border-border px-3 py-2 text-xs font-medium">
          Editar
        </button>
      )}

      <AppDialog
        open={open}
        onClose={() => closeModal("editStaff")}
        title={
          <>
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Equipo
            </span>
            <span className="mt-1 block text-lg font-medium text-foreground">
              Editar personal
            </span>
          </>
        }
        size="md">
        <UpdateStaffForm
          staff={staff}
          onSuccess={() => closeModal("editStaff")}
        />
      </AppDialog>
    </>
  );
}
