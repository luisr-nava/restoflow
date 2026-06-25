"use client";

import { useState } from "react";

import { MenuCategoriesView } from "@/src/features/menu-categories/components/menu-categories-view";
import { ErrorState, LoadingState } from "@/src/shared/components/states";

import { CreateMenuItemModal } from "./create-menu-item-modal";
import { MenuItemsList } from "./menu-items-list";
import { useGetMenuItems } from "../hooks/use-get-menu-items";

type MenuTab = "items" | "categories";

export function MenuView() {
  const [activeTab, setActiveTab] = useState<MenuTab>("items");
  const { data: items = [], error, isError, isLoading } = useGetMenuItems();

  return (
    <section className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.18em] text-muted-foreground">
            Menu
          </p>

          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            Menú del restaurante
          </h1>
        </div>

        <CreateMenuItemModal showTrigger={activeTab === "items"} />
      </div>

      <div className="flex gap-2 border-b border-border">
        <button
          type="button"
          onClick={() => setActiveTab("items")}
          className={`border-b px-3 py-2 text-sm font-medium ${
            activeTab === "items"
              ? "border-foreground text-foreground"
              : "border-transparent text-muted-foreground"
          }`}>
          Items
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("categories")}
          className={`border-b px-3 py-2 text-sm font-medium ${
            activeTab === "categories"
              ? "border-foreground text-foreground"
              : "border-transparent text-muted-foreground"
          }`}>
          Categorías
        </button>
      </div>

      {activeTab === "items" ? (
        isLoading ? (
          <LoadingState
            label="Cargando productos..."
            className="min-h-[320px] flex items-center justify-center"
          />
        ) : isError ? (
          <ErrorState
            title="No se pudieron cargar los productos"
            description={error.message}
            className="min-h-[320px] flex items-center justify-center"
          />
        ) : (
          <MenuItemsList items={items} />
        )
      ) : (
        <MenuCategoriesView />
      )}
    </section>
  );
}
