"use client";

import { AppDialog } from "@/src/shared/components/ui/AppDialog";
import { Button } from "@/src/shared/components/ui/Button";
import { useUiModalStore } from "@/src/shared/stores/ui-modal.store";
import { useDeleteMenuItem } from "../hooks/use-delete-menu-item";
import type { MenuItem } from "../types/menu-item.types";

type DeleteMenuItemButtonProps = {
  item: MenuItem;
  showTrigger?: boolean;
};

export function DeleteMenuItemButton({
  item,
  showTrigger = true,
}: DeleteMenuItemButtonProps) {
  const openModal = useUiModalStore((state) => state.openModal);
  const closeModal = useUiModalStore((state) => state.closeModal);
  const open = useUiModalStore(
    (state) =>
      state.modals.deleteMenuItem?.open === true &&
      state.modals.deleteMenuItem?.payload?.menuItemId === item.id,
  );
  const { mutate, isPending } = useDeleteMenuItem();

  const onDelete = () => {
    mutate(
      {
        menuItemId: item.id,
      },
      {
        onSuccess: () => {
          closeModal("deleteMenuItem");
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
          onClick={() => openModal("deleteMenuItem", { menuItemId: item.id })}
          disabled={isPending}>
          Eliminar
        </Button>
      )}

      <AppDialog
        open={open}
        onClose={() => closeModal("deleteMenuItem")}
        title={
          <>
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Eliminar item
            </span>
            <span className="mt-2 block text-lg font-medium text-foreground">
              ¿Eliminar {item.name}?
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
              onClick={() => closeModal("deleteMenuItem")}
              disabled={isPending}>
              Cancelar
            </Button>

            <Button
              type="button"
              variant="danger"
              size="sm"
              onClick={onDelete}
              disabled={isPending}>
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
