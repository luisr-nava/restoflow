import { useQuery } from "@tanstack/react-query";

import type { Restaurant } from "../types/restaurant.types";
import { restaurantKeys } from "../query-keys/restaurant.keys";

const RESTAURANT_SETTINGS_STALE_TIME_MS = 5 * 60 * 1000;
const RESTAURANT_SETTINGS_GC_TIME_MS = 30 * 60 * 1000;

type RestaurantSettingsResponse = {
  data: Restaurant | null;
  error: string;
};

async function fetchRestaurantSettings(): Promise<RestaurantSettingsResponse> {
  const response = await fetch("/api/restaurants/settings", {
    method: "GET",
  });

  if (!response.ok) {
    const payload = (await response.json().catch(() => null)) as {
      error?: string;
    } | null;

    throw new Error(
      payload?.error ?? "No se pudo cargar la configuración del restaurante",
    );
  }

  return (await response.json()) as RestaurantSettingsResponse;
}

export function useGetRestaurantSettings(enabled = true) {
  return useQuery({
    queryKey: restaurantKeys.settings,
    queryFn: fetchRestaurantSettings,
    enabled,
    staleTime: RESTAURANT_SETTINGS_STALE_TIME_MS,
    gcTime: RESTAURANT_SETTINGS_GC_TIME_MS,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
}
