"use client";

import {
  createContext,
  type PropsWithChildren,
  useMemo,
} from "react";
import { useGetRestaurantSettings } from "../hooks/use-get-restaurant-settings";
import type { Restaurant } from "../types/restaurant.types";

export type RestaurantSettingsContextValue = {
  restaurant: Restaurant | null;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
};

export const RestaurantSettingsContext =
  createContext<RestaurantSettingsContextValue | null>(null);

export function RestaurantSettingsProvider({
  children,
}: PropsWithChildren) {
  const { data, isLoading, isError, error } = useGetRestaurantSettings();

  const value = useMemo<RestaurantSettingsContextValue>(
    () => ({
      restaurant: data?.data ?? null,
      isLoading,
      isError,
      error: error ?? null,
    }),
    [data?.data, error, isError, isLoading],
  );

  return (
    <RestaurantSettingsContext.Provider value={value}>
      {children}
    </RestaurantSettingsContext.Provider>
  );
}
