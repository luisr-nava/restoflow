"use client";

import { useQuery } from "@tanstack/react-query";

import { getStaffMenuItemsAction } from "../actions/menu-item.actions";

export function useGetStaffMenuItems() {
  return useQuery({
    queryKey: ["staff-menu-items"],
    queryFn: getStaffMenuItemsAction,
  });
}
