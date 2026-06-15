"use client";

import { useQuery } from "@tanstack/react-query";

import { getMenuCategoriesAction } from "../actions/menu-category.actions";

export function useGetMenuCategories() {
  return useQuery({
    queryKey: ["menu-categories"],
    queryFn: getMenuCategoriesAction,
  });
}
