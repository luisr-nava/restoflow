"use client";

import { useState } from "react";

import { CloseTableForm } from "./close-table-form";

type CloseTableModalProps = {
  tableId: string;
  total: number;
  disabled?: boolean;
  mode?: "admin" | "staff";
};

export function CloseTableModal({
  tableId,
  total,
  disabled = false,
  mode = "admin",
}: CloseTableModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(true)}
        className="rounded-lg border border-border px-3 py-2 text-xs font-medium text-foreground disabled:cursor-not-allowed disabled:opacity-40">
        Cerrar mesa
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-2xl border border-border bg-background p-6 shadow-lg">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  Cobro
                </p>
                <h2 className="mt-1 text-lg font-medium text-foreground">
                  Cerrar mesa
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-lg border border-border px-3 py-2 text-xs">
                Cerrar
              </button>
            </div>

            <CloseTableForm
              tableId={tableId}
              total={total}
              mode={mode}
              onSuccess={() => setOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}



