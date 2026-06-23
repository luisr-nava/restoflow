"use client";

import { Menu, Plus } from "lucide-react";
import { usePathname } from "next/navigation";
import { useUiLayoutStore } from "@/src/shared/stores/ui-layout.store";
import { useUiModalStore } from "@/src/shared/stores/ui-modal.store";
import { useUiSelectionStore } from "@/src/shared/stores/ui-selection.store";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/dashboard/tables": "Mesas",
  "/dashboard/orders": "Pedidos",
  "/dashboard/kitchen": "Cocina",
  "/dashboard/menu": "Menú",
  "/dashboard/team": "Equipo",
  "/dashboard/reports": "Reportes",
  "/dashboard/qr": "QR Mesas",
  "/dashboard/settings": "Configuración",
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
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-text-3">
            Restaurant OS / Dashboard
          </p>

          <h1 className="mt-1 font-serif text-3xl italic leading-none tracking-tight text-text">
            {pageTitle}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            aria-label="Abrir menú de navegación"
            onClick={toggleMobileSidebar}
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text lg:hidden">
            <Menu className="size-4" />
          </button>

          {primaryAction && (
            <button
              type="button"
              aria-label={primaryAction.label}
              onClick={primaryAction.onClick}
              disabled={primaryAction.disabled}
              className="inline-flex items-center gap-2 rounded-lg bg-text px-4 py-2 text-sm font-medium text-bg hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40">
              <Plus className="size-4" />
              <span className="hidden sm:inline">{primaryAction.label}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
