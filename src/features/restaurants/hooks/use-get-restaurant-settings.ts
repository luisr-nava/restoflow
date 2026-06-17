import { useQuery } from "@tanstack/react-query";

import { getRestaurantSettingsAction } from "../actions/restaurant.actions";

export function useGetRestaurantSettings() {
  return useQuery({
    queryKey: ["restaurant-settings"],
    queryFn: getRestaurantSettingsAction,
  });
}
