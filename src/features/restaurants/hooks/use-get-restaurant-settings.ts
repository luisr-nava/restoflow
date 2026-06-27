import { useQuery } from "@tanstack/react-query";

import { getRestaurantSettingsAction } from "../actions/restaurant.actions";
import { restaurantKeys } from "../query-keys/restaurant.keys";

export function useGetRestaurantSettings(enabled = true) {
  return useQuery({
    queryKey: restaurantKeys.settings,
    queryFn: getRestaurantSettingsAction,
    enabled,
  });
}
