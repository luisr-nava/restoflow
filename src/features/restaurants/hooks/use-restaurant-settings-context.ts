"use client";

import { useContext } from "react";
import { useGetRestaurantSettings } from "./use-get-restaurant-settings";
import { RestaurantSettingsContext } from "../providers/restaurant-settings-provider";

export function useRestaurantSettingsContext() {
  const context = useContext(RestaurantSettingsContext);

  if (!context) {
    throw new Error(
      "useRestaurantSettingsContext debe usarse dentro de RestaurantSettingsProvider",
    );
  }

  return context;
}

export function useRestaurantSettingsContextFallback(enabledFallback = true) {
  const context = useContext(RestaurantSettingsContext);
  const query = useGetRestaurantSettings(enabledFallback && context === null);

  return {
    restaurant: context?.restaurant ?? query.data?.data ?? null,
    isLoading: context?.isLoading ?? query.isLoading,
    isError: context?.isError ?? query.isError,
    error: context?.error ?? query.error ?? null,
  };
}
