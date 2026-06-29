"use client";

import { Menu, Plus } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "@/src/shared/components/ui/Button";
import { useUiLayoutStore } from "@/src/shared/stores/ui-layout.store";
import { useUiModalStore } from "@/src/shared/stores/ui-modal.store";
import { useUiSelectionStore } from "@/src/shared/stores/ui-selection.store";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/reservations": "Reservas",
  "/dashboard/tables": "Mesas",
  "/dashboard/orders": "Pedidos",
  "/dashboard/kitchen": "Cocina",
  "/dashboard/menu": "Menú",
  "/dashboard/team": "Equipo",
  "/dashboard/reports": "Reportes",
  "/dashboard/qr": "QR Mesas",
  "/dashboard/settings": "Configuración",
};

const pageSubtitles: Record<string, string> = {
  "/dashboard": "Resumen general del restaurante.",
  "/dashboard/reservations": "Gestiona las reservas de tus clientes.",
  "/dashboard/tables": "Administra la distribución y el estado de las mesas.",
  "/dashboard/orders": "Consulta y administra los pedidos activos.",
  "/dashboard/kitchen": "Supervisa el flujo de preparación de los pedidos.",
  "/dashboard/menu": "Gestiona categorías, productos y precios.",
  "/dashboard/team": "Administra el personal y sus roles.",
  "/dashboard/reports": "Analiza el rendimiento y las ventas del restaurante.",
  "/dashboard/qr": "Genera e imprime los códigos QR para las mesas.",
  "/dashboard/settings":
    "Configura la información y preferencias del restaurante.",
};
type PrimaryActionConfig = {
  disabled?: boolean;
  label: string;
  onClick: () => void;
};

export function DashboardNavbar() {
  const pathname = usePathname();
  const toggleMobileSidebar = useUiLayoutStore(
    (state) => state.toggleMobileSidebar,
  );
  const openModal = useUiModalStore((state) => state.openModal);
  const selectedFloorId = useUiSelectionStore((state) => state.selectedFloorId);
  const pageTitle = pageTitles[pathname] ?? "Dashboard";
  const pageSubtitle =
    pageSubtitles[pathname] ?? "Resumen general del restaurante.";

  let primaryAction: PrimaryActionConfig | null = null;

  if (pathname === "/dashboard/tables") {
    primaryAction = {
      label: "Nueva mesa",
      disabled: !selectedFloorId,
      onClick: () => {
        if (!selectedFloorId) {
          return;
        }

        openModal("createTable", { floorId: selectedFloorId });
      },
    };
  }

  if (pathname === "/dashboard/team") {
    primaryAction = {
      label: "Nuevo personal",
      onClick: () => openModal("createStaff"),
    };
  }

  if (pathname === "/dashboard/menu") {
    primaryAction = {
      label: "Nuevo producto",
      onClick: () => openModal("createMenuItem"),
    };
  }

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/95 backdrop-blur">
      <div className="flex min-h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div>
          <h1 className="mt-1 font-serif text-3xl italic leading-none tracking-tight text-text">
            {pageTitle}
          </h1>
          <p className="font-serif text-sm text-muted-foreground italic">
            {pageSubtitle}
          </p>{" "}
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label="Abrir menú de navegación"
            onClick={toggleMobileSidebar}
            className="h-8 w-10 bg-surface text-text lg:hidden"
            leftIcon={<Menu className="size-4" />}
          />

          {primaryAction && (
            <Button
              type="button"
              variant="primary"
              size="md"
              aria-label={primaryAction.label}
              onClick={primaryAction.onClick}
              disabled={primaryAction.disabled}
              className="hover:opacity-90 disabled:opacity-40"
              leftIcon={<Plus className="size-4" />}>
              <span className="hidden sm:inline">{primaryAction.label}</span>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
