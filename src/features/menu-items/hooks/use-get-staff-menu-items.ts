"use client";

import { useQuery } from "@tanstack/react-query";

import { getStaffMenuItemsAction } from "../actions/menu-item.actions";
import { menuItemKeys } from "../query-keys/menu-item.keys";

export function useGetStaffMenuItems() {
  return useQuery({
    queryKey: menuItemKeys.staffAll,
    queryFn: getStaffMenuItemsAction,
  });
}
