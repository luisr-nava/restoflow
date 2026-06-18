"use client";

import { LogOut } from "lucide-react";

import { useStaffLogout } from "../hooks/use-staff-logout";
import type { StaffSession } from "../types/staff-auth.types";

type StaffHeaderProps = {
  session: StaffSession;
  title: string;
};

export function StaffHeader({ session, title }: StaffHeaderProps) {
  const { mutate, isPending } = useStaffLogout();

  return (
    <header className="rounded-2xl border border-border bg-surface p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>

          <h1 className="mt-1 text-2xl font-semibold text-foreground">
            Hola, {session.name}
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            {session.role === "WAITER" ? "Mozo" : "Cocina"}
          </p>
        </div>

        <button
          type="button"
          onClick={() => mutate()}
          disabled={isPending}
          className="inline-flex items-center gap-2 rounded-xl border border-border px-3 py-2 text-sm text-muted-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-60">
          <LogOut className="h-4 w-4" />
          {isPending ? "Saliendo..." : "Salir"}
        </button>
      </div>
    </header>
  );
}
