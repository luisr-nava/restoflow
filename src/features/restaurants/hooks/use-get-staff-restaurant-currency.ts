import { useQuery } from "@tanstack/react-query";

import { getStaffRestaurantCurrencyAction } from "../actions/restaurant.actions";
import { restaurantKeys } from "../query-keys/restaurant.keys";

export function useGetStaffRestaurantCurrency() {
  return useQuery<
    Awaited<ReturnType<typeof getStaffRestaurantCurrencyAction>>,
    Error
  >({
    queryKey: restaurantKeys.staffCurrency,
    queryFn: getStaffRestaurantCurrencyAction,
  });
}
