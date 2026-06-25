"use client";

import { useQuery } from "@tanstack/react-query";

import { getMenuCategoriesAction } from "../actions/menu-category.actions";
import { menuCategoryKeys } from "../query-keys/menu-category.keys";

export function useGetMenuCategories() {
  return useQuery<Awaited<ReturnType<typeof getMenuCategoriesAction>>, Error>({
    queryKey: menuCategoryKeys.all,
    queryFn: getMenuCategoriesAction,
  });
}
