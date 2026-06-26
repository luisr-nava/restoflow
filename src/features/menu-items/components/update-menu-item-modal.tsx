"use client";

import { AppDialog } from "@/src/shared/components/ui/AppDialog";
import { useUiModalStore } from "@/src/shared/stores/ui-modal.store";
import type { MenuItem } from "../types/menu-item.types";
import { UpdateMenuItemForm } from "./update-menu-item-form";

type UpdateMenuItemModalProps = {
  item: MenuItem;
  showTrigger?: boolean;
};

export function UpdateMenuItemModal({
  item,
  showTrigger = true,
}: UpdateMenuItemModalProps) {
  const openModal = useUiModalStore((state) => state.openModal);
  const closeModal = useUiModalStore((state) => state.closeModal);
  const open = useUiModalStore(
    (state) =>
      state.modals.editMenuItem?.open === true &&
      state.modals.editMenuItem?.payload?.menuItemId === item.id,
  );

  return (
    <>
      {showTrigger && (
        <button
          type="button"
          onClick={() => openModal("editMenuItem", { menuItemId: item.id })}
          className="rounded-lg border border-border px-3 py-2 text-xs font-medium">
          Editar
        </button>
      )}

      <AppDialog
        open={open}
        onClose={() => closeModal("editMenuItem")}
        title={
          <>
            <span className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Menú
            </span>
            <span className="mt-1 block text-lg font-medium text-foreground">
              Editar item
            </span>
          </>
        }
        size="md">
        <UpdateMenuItemForm
          item={item}
          onSuccess={() => closeModal("editMenuItem")}
        />
      </AppDialog>
    </>
  );
}
