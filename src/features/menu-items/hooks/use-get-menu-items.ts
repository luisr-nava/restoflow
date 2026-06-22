"use client";

import { useQuery } from "@tanstack/react-query";

import { getMenuItemsAction } from "../actions/menu-item.actions";
import { menuItemKeys } from "../query-keys/menu-item.keys";

export function useGetMenuItems() {
  return useQuery({
    queryKey: menuItemKeys.all,
    queryFn: getMenuItemsAction,
  });
}
