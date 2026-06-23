"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  ChefHat,
  ClipboardList,
  LayoutDashboard,
  Settings,
  Table2,
  Users,
  Utensils,
  QrCode,
} from "lucide-react";
import { useUiLayoutStore } from "@/src/shared/stores/ui-layout.store";

const navItems = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    label: "Mesas",
    href: "/dashboard/tables",
    icon: Table2,
  },
  {
    label: "Pedidos",
    href: "/dashboard/orders",
    icon: ClipboardList,
  },
  {
    label: "Cocina",
    href: "/dashboard/kitchen",
    icon: ChefHat,
  },
  {
    label: "Menú",
    href: "/dashboard/menu",
    icon: Utensils,
  },
  {
    label: "Equipo",
    href: "/dashboard/team",
    icon: Users,
  },
  {
    label: "Reportes",
    href: "/dashboard/reports",
    icon: BarChart3,
  },
  {
    label: "QR Mesas",
    href: "/dashboard/qr",
    icon: QrCode,
  },
] as const;

type SidebarContentProps = {
  pathname: string;
  onNavigate?: () => void;
};

function SidebarContent({ pathname, onNavigate }: SidebarContentProps) {
  const isSettingsActive = pathname === "/dashboard/settings";

  return (
    <>
      <div className="flex items-center gap-3 px-2 pb-6">
        <div className="grid size-8 place-items-center rounded-lg bg-text font-serif text-lg italic text-bg">
          R
        </div>

        <div>
          <p className="text-sm font-semibold leading-none text-text">
            Restoflow
          </p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.08em] text-text-3">
            Manager
          </p>
        </div>
      </div>

      <nav className="space-y-1">
        <p className="px-2 pb-2 font-mono text-[10px] uppercase tracking-[0.08em] text-text-3">
          Operación
        </p>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive ? "page" : undefined}
              onClick={onNavigate}
              className={`flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition ${
                isActive
                  ? "bg-surface-2 text-text"
                  : "text-text-2 hover:bg-surface-2 hover:text-text"
              }`}>
              <Icon
                className={`size-4 ${
                  isActive ? "text-text" : "text-text-3"
                }`}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-1 border-t border-border pt-4">
        <Link
          href="/dashboard/settings"
          aria-current={isSettingsActive ? "page" : undefined}
          onClick={onNavigate}
          className={`flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition ${
            isSettingsActive
              ? "bg-surface-2 text-text"
              : "text-text-2 hover:bg-surface-2 hover:text-text"
          }`}>
          <Settings
            className={`size-4 ${
              isSettingsActive ? "text-text" : "text-text-3"
            }`}
          />
          Configuración
        </Link>

        <div className="mt-3 flex items-center gap-3 px-2 py-2">
          <div className="grid size-8 place-items-center rounded-full bg-accent-soft text-xs font-semibold text-accent-ink">
            LN
          </div>

          <div>
            <p className="text-sm font-medium leading-none text-text">
              Luis Nava
            </p>
            <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.08em] text-text-3">
              Owner
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export function DashboardSidebar() {
  const pathname = usePathname();
  const isMobileSidebarOpen = useUiLayoutStore(
    (state) => state.isMobileSidebarOpen,
  );
  const closeMobileSidebar = useUiLayoutStore(
    (state) => state.closeMobileSidebar,
  );

  useEffect(() => {
    closeMobileSidebar();
  }, [pathname, closeMobileSidebar]);

  return (
    <>
      <aside className="hidden border-r border-border bg-surface px-3 py-5 lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:overflow-y-auto">
        <SidebarContent pathname={pathname} />
      </aside>

      {isMobileSidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="Cerrar sidebar"
            onClick={closeMobileSidebar}
            className="absolute inset-0 bg-black/50"
          />

          <aside className="absolute inset-y-0 left-0 flex w-[280px] max-w-[85vw] flex-col overflow-y-auto border-r border-border bg-surface px-3 py-5 shadow-xl">
            <SidebarContent
              pathname={pathname}
              onNavigate={closeMobileSidebar}
            />
          </aside>
        </div>
      )}
    </>
  );
}
