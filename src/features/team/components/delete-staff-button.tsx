"use client";

import { AppDialog } from "@/src/shared/components/ui/AppDialog";
import { Button } from "@/src/shared/components/ui/Button";
import { useUiModalStore } from "@/src/shared/stores/ui-modal.store";
import { useDeleteStaff } from "../hooks/use-delete-staff";
import type { RestaurantStaff } from "../types/team.types";

type DeleteStaffButtonProps = {
  staff: RestaurantStaff;
  showTrigger?: boolean;
};

export function DeleteStaffButton({
  staff,
  showTrigger = true,
}: DeleteStaffButtonProps) {
  const openModal = useUiModalStore((state) => state.openModal);
  const closeModal = useUiModalStore((state) => state.closeModal);
  const open = useUiModalStore(
    (state) =>
      state.modals.deleteStaff?.open === true &&
      state.modals.deleteStaff?.payload?.staffId === staff.id,
  );
  const { mutate, isPending } = useDeleteStaff();

  const onDelete = () => {
    mutate(
      {
        staffId: staff.id,
      },
      {
        onSuccess: (response) => {
          if (response.error) {
            return;
          }

          closeModal("deleteStaff");
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
          onClick={() => openModal("deleteStaff", { staffId: staff.id })}
          disabled={isPending}
          className="border-destructive text-destructive disabled:opacity-50">
          Eliminar
        </Button>
      )}

      <AppDialog
        open={open}
        onClose={() => closeModal("deleteStaff")}
        title={
          <>
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Eliminar personal
            </span>
            <span className="mt-2 block text-lg font-medium text-foreground">
              ¿Eliminar a {staff.name}?
            </span>
          </>
        }
        size="sm"
        footer={
          <>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => closeModal("deleteStaff")}
              disabled={isPending}>
              Cancelar
            </Button>

            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={onDelete}
              disabled={isPending}
              className="border-destructive text-destructive disabled:opacity-50">
              {isPending ? "Eliminando..." : "Eliminar"}
            </Button>
          </>
        }>
        <p className="text-sm text-muted-foreground">
          Esta acción no se puede deshacer.
        </p>
      </AppDialog>
    </>
  );
}
