"use client";

import { useState } from "react";

import { useDeleteMenuCategory } from "../hooks/use-delete-menu-category";
import type { MenuCategory } from "../types/menu-category.types";

type DeleteMenuCategoryButtonProps = {
  category: MenuCategory;
};

export function DeleteMenuCategoryButton({
  category,
}: DeleteMenuCategoryButtonProps) {
  const [open, setOpen] = useState(false);
  const { mutate, isPending } = useDeleteMenuCategory();

  const onDelete = () => {
    mutate(category.id, {
      onSuccess: (response) => {
        if (response.error) {
          return;
        }

        setOpen(false);
      },
    });
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        disabled={isPending}
        className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 disabled:cursor-not-allowed disabled:opacity-40">
        Eliminar
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-2xl border border-border bg-background p-6 shadow-lg">
            <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Eliminar categoría
            </p>

            <h2 className="mt-2 text-lg font-medium text-foreground">
              ¿Eliminar {category.name}?
            </h2>

            <p className="mt-2 text-sm text-muted-foreground">
              Si tiene productos asociados, no se podrá eliminar.
            </p>

            <div className="mt-6 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
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
