"use client";

import { Tab, TabGroup, TabList, TabPanel, TabPanels } from "@headlessui/react";
import Image from "next/image";

import { useGetStaffMenuItems } from "@/src/features/menu-items/hooks/use-get-staff-menu-items";
import { useGetStaffRestaurantCurrency } from "@/src/features/restaurants/hooks/use-get-staff-restaurant-currency";
import { StaffTablesList } from "@/src/features/tables/components/StaffTablesList";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "@/src/shared/components/states";
import { Card, CardTitle } from "@/src/shared/components/ui/Card";
import { formatMoney } from "@/src/shared/utils/format-money";
import { useState } from "react";
import { twMerge } from "tailwind-merge";

export function StaffWaiterView() {
  const tabClass = (selected: boolean) =>
    twMerge(
      "flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-colors",
      selected
        ? "bg-text text-surface"
        : "bg-surface text-text-3 hover:bg-surface-2",
    );
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <TabGroup
      selectedIndex={selectedIndex}
      onChange={setSelectedIndex}
      className="space-y-4">
      <TabList className="flex rounded-xl border border-border bg-surface p-1">
        <Tab className={tabClass(selectedIndex === 0)}>Mesas</Tab>

        <Tab className={tabClass(selectedIndex === 1)}>Menú</Tab>
      </TabList>

      <TabPanels>
        <TabPanel>
          <StaffTablesList />
        </TabPanel>

        <TabPanel>
          <StaffMenuPreview />
        </TabPanel>
      </TabPanels>
    </TabGroup>
  );
}

function StaffMenuPreview() {
  const {
    data: items = [],
    isLoading,
    isError,
    error,
  } = useGetStaffMenuItems();
  const { data: staffRestaurantCurrency } = useGetStaffRestaurantCurrency();
  const currency = staffRestaurantCurrency?.data?.currency;

  const visibleItems = items.filter(
    (item) => item.menu_categories?.is_active !== false,
  );

  if (isLoading) {
    return <LoadingState label="Cargando menú..." className="bg-surface" />;
  }

  if (isError) {
    return (
      <ErrorState
        title="No se pudo cargar el menú"
        description={error.message}
        className="bg-surface"
      />
    );
  }

  if (visibleItems.length === 0) {
    return (
      <EmptyState
        title="No hay platos disponibles"
        description="Cuando el menú tenga items activos, van a aparecer acá."
        className="bg-surface"
      />
    );
  }

  return (
    <div className="grid gap-3">
      {visibleItems.map((item) => (
        <Card
          key={item.id}
          variant="muted"
          size="lg"
          className="p-4">
          <div className="flex gap-3">
            {item.image_url ? (
              <Image
                src={item.image_url}
                alt={item.name}
                width={80}
                height={80}
                unoptimized
                className="h-20 w-20 rounded-xl object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-xl border border-border text-xs text-muted-foreground">
                Sin foto
              </div>
            )}

            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <CardTitle className="text-sm font-medium">{item.name}</CardTitle>

                  {item.menu_categories?.name && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      {item.menu_categories.name}
                    </p>
                  )}
                </div>

                <p className="shrink-0 text-sm font-semibold text-foreground">
                  {formatMoney(item.price, currency)}
                </p>
              </div>

              {item.description && (
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                  {item.description}
                </p>
              )}

              {!item.is_available && (
                <p className="mt-2 text-xs font-medium text-muted-foreground">
                  No disponible
                </p>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
