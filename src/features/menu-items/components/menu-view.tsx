"use client";

import { useState } from "react";

import { MenuCategoriesView } from "@/src/features/menu-categories/components/menu-categories-view";
import { ErrorState } from "@/src/shared/components/states";
import { Button } from "@/src/shared/components/ui/Button";
import { Card } from "@/src/shared/components/ui/Card";
import { Skeleton } from "@/src/shared/components/ui/Skeleton";

import { CreateMenuItemModal } from "./create-menu-item-modal";
import { MenuItemsList } from "./menu-items-list";
import { useGetMenuItems } from "../hooks/use-get-menu-items";

type MenuTab = "items" | "categories";

function MenuItemsLoadingSkeleton() {
  return (
    <div className="grid gap-3">
      {Array.from({ length: 4 }).map((_, index) => (
        <Card key={index} variant="default" size="lg" className="p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex gap-3">
              <Skeleton className="h-14 w-14 rounded-xl" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-4 w-56" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <div className="space-y-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-8 w-28 rounded-lg" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

export function MenuView() {
  const [activeTab, setActiveTab] = useState<MenuTab>("items");
  const { data: items = [], error, isError, isLoading } = useGetMenuItems();

  return (
    <section className="space-y-4">
      <div className="flex items-start justify-between gap-4">
        <CreateMenuItemModal showTrigger={activeTab === "items"} />
      </div>

      <div className="flex gap-2 border-b border-border">
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setActiveTab("items")}
          className={`rounded-none border-b border-x-0 border-t-0 px-3 py-2 text-sm font-medium hover:bg-transparent ${
            activeTab === "items"
              ? "border-foreground text-foreground"
              : "border-transparent text-muted-foreground"
            }`}>
          Items
        </Button>

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => setActiveTab("categories")}
          className={`rounded-none border-b border-x-0 border-t-0 px-3 py-2 text-sm font-medium hover:bg-transparent ${
            activeTab === "categories"
              ? "border-foreground text-foreground"
              : "border-transparent text-muted-foreground"
            }`}>
          Categorías
        </Button>
      </div>

      {activeTab === "items" ? (
        isLoading ? (
          <MenuItemsLoadingSkeleton />
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
