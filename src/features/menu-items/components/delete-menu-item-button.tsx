"use client";

import { useUiModalStore } from "@/src/shared/stores/ui-modal.store";
import { useDeleteMenuItem } from "../hooks/use-delete-menu-item";
import type { MenuItem } from "../types/menu-item.types";

type DeleteMenuItemButtonProps = {
  item: MenuItem;
};

export function DeleteMenuItemButton({ item }: DeleteMenuItemButtonProps) {
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
      <button
        type="button"
        onClick={() => openModal("deleteMenuItem", { menuItemId: item.id })}
        disabled={isPending}
        className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 disabled:cursor-not-allowed disabled:opacity-40">
        Eliminar
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-background p-6 shadow-lg">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Eliminar item
            </p>

            <h2 className="mt-2 text-lg font-medium text-foreground">
              ¿Eliminar {item.name}?
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Esta acción no se puede deshacer.
            </p>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => closeModal("deleteMenuItem")}
                disabled={isPending}
                className="rounded-lg border border-border px-3 py-2 text-xs">
                Cancelar
              </button>

              <button
                type="button"
                onClick={onDelete}
                disabled={isPending}
                className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 disabled:opacity-40">
                {isPending ? "Eliminando..." : "Eliminar"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
