import { Menu, Plus } from "lucide-react";

export function DashboardNavbar() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/95 backdrop-blur">
      <div className="flex min-h-20 items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-text-3">
            Restaurant OS / Dashboard
          </p>

          <h1 className="mt-1 font-serif text-3xl italic leading-none tracking-tight text-text">
            Overview
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text lg:hidden">
            <Menu className="size-4" />
          </button>

          <button
            type="button"
            className="hidden rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-text hover:bg-surface-2 sm:block">
            Exportar
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-lg bg-text px-4 py-2 text-sm font-medium text-bg hover:opacity-90">
            <Plus className="size-4" />
            <span className="hidden sm:inline">Nuevo pedido</span>
          </button>
        </div>
      </div>
    </header>
  );
}
