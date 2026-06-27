"use client";

import { useQuery } from "@tanstack/react-query";

import { getStaffMenuItemsAction } from "../actions/menu-item.actions";
import { menuItemKeys } from "../query-keys/menu-item.keys";

export function useGetStaffMenuItems(enabled = true) {
  return useQuery<Awaited<ReturnType<typeof getStaffMenuItemsAction>>, Error>({
    queryKey: menuItemKeys.staffAll,
    queryFn: getStaffMenuItemsAction,
    enabled,
  });
}
