import Link from "next/link";
import {
  BarChart3,
  ChefHat,
  ClipboardList,
  LayoutDashboard,
  Settings,
  Table2,
  Users,
  Utensils,
} from "lucide-react";

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
];

export function DashboardSidebar() {
  return (
    <aside className="hidden min-h-screen border-r border-border bg-surface px-3 py-5 lg:flex lg:flex-col">
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

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm text-text-2 transition hover:bg-surface-2 hover:text-text">
              <Icon className="size-4 text-text-3" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto space-y-1 border-t border-border pt-4">
        <Link
          // href="/dashboard/settings"
          href="/"
          className="flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm text-text-2 transition hover:bg-surface-2 hover:text-text">
          <Settings className="size-4 text-text-3" />
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
    </aside>
  );
}
