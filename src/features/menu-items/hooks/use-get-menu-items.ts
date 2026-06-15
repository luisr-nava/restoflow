"use client";

import { useQuery } from "@tanstack/react-query";

import { getMenuItemsAction } from "../actions/menu-item.actions";

export function useGetMenuItems() {
  return useQuery({
    queryKey: ["menu-items"],
    queryFn: getMenuItemsAction,
  });
}
