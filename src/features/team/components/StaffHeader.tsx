"use client";

import { LogOut } from "lucide-react";
import { Button } from "@/src/shared/components/ui/Button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/src/shared/components/ui/Card";

import { useStaffLogout } from "../hooks/use-staff-logout";
import type { StaffSession } from "../types/staff-auth.types";

type StaffHeaderProps = {
  session: StaffSession;
  title: string;
};

export function StaffHeader({ session, title }: StaffHeaderProps) {
  const { mutate, isPending } = useStaffLogout();

  return (
    <Card as="header" variant="muted" size="lg" className="p-5">
      <div className="flex items-start justify-between gap-4">
        <CardHeader>
          <CardDescription>{title}</CardDescription>

          <CardTitle className="text-2xl">Hola, {session.name}</CardTitle>

          <p className="text-sm text-muted-foreground">
            {session.role === "WAITER" ? "Mozo" : "Cocina"}
          </p>
        </CardHeader>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => mutate()}
          disabled={isPending}
          className="rounded-xl disabled:opacity-60"
          leftIcon={<LogOut className="h-4 w-4" />}>
          {isPending ? "Saliendo..." : "Salir"}
        </Button>
      </div>
    </Card>
  );
}
