"use client";

import {
  ActionMenu,
  ActionMenuItem,
} from "@/src/shared/components/ui/ActionMenu";
import {
  EmptyState,
  ErrorState,
} from "@/src/shared/components/states";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/shared/components/ui/Card";
import { Skeleton } from "@/src/shared/components/ui/Skeleton";
import { useUiModalStore } from "@/src/shared/stores/ui-modal.store";
import { CreateStaffModal } from "./create-staff-modal";
import { useGetStaff } from "../hooks/use-get-staff";
import { UpdateStaffModal } from "./update-staff-modal";
import { DeleteStaffButton } from "./delete-staff-button";

const roleLabel = {
  WAITER: "Mozo",
  KITCHEN: "Cocina",
} as const;

export function TeamView() {
  const { data: staff = [], error, isError, isLoading } = useGetStaff();
  const openModal = useUiModalStore((state) => state.openModal);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <CreateStaffModal />
      </div>

      <Card variant="default" size="lg" className="p-0">
        <CardHeader className="border-b border-border px-4 py-3">
          <CardTitle className="text-sm font-medium">Personal</CardTitle>
        </CardHeader>

        {isLoading ? (
          <CardContent className="divide-y divide-border">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center justify-between gap-4 p-4">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-40" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                  <Skeleton className="h-8 w-8 rounded-lg" />
                </div>
              </div>
            ))}
          </CardContent>
        ) : isError ? (
          <ErrorState
            title="No se pudo cargar el personal"
            description={error.message}
            className="rounded-none border-0 bg-transparent"
          />
        ) : staff.length === 0 ? (
          <EmptyState
            title="Todavía no cargaste personal"
            description="Agregá mozos o cocina para empezar a operar con roles."
            className="rounded-none border-0 bg-transparent"
          />
        ) : (
          <CardContent className="divide-y divide-border">
            {staff.map((member) => (
              <div
                key={member.id}
                className="flex items-center justify-between gap-4 p-4">
                <div>
                  <h3 className="text-sm font-medium">{member.name}</h3>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {member.email || "Sin email"}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className="rounded-full border border-border px-2 py-1 font-mono text-[10px] uppercase">
                    {roleLabel[member.role]}
                  </span>

                  <span
                    className={`rounded-full border px-2 py-1 font-mono text-[10px] uppercase ${
                      member.is_active
                        ? "border-green-500/30 text-green-600"
                        : "border-red-500/30 text-red-600"
                    }`}>
                    {member.is_active ? "Activo" : "Inactivo"}
                  </span>

                  <ActionMenu ariaLabel={`Acciones de ${member.name}`}>
                    <ActionMenuItem
                      onClick={() =>
                        openModal("editStaff", { staffId: member.id })
                      }>
                      Editar
                    </ActionMenuItem>

                    <ActionMenuItem
                      onClick={() =>
                        openModal("deleteStaff", { staffId: member.id })
                      }
                      tone="danger">
                      Eliminar
                    </ActionMenuItem>
                  </ActionMenu>

                  <UpdateStaffModal staff={member} showTrigger={false} />
                  <DeleteStaffButton staff={member} showTrigger={false} />
                </div>
              </div>
            ))}
          </CardContent>
        )}
      </Card>
    </div>
  );
}
