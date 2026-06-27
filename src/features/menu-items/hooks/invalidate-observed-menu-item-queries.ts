"use client";

import type { QueryClient } from "@tanstack/react-query";

import { menuItemKeys } from "../query-keys/menu-item.keys";

export async function invalidateObservedMenuItemQueries(
  queryClient: QueryClient,
) {
  const invalidations: Promise<void>[] = [];
  const adminMenuQuery = queryClient
    .getQueryCache()
    .find({ queryKey: menuItemKeys.all });
  const staffMenuQuery = queryClient
    .getQueryCache()
    .find({ queryKey: menuItemKeys.staffAll });

  if ((adminMenuQuery?.getObserversCount() ?? 0) > 0) {
    invalidations.push(
      queryClient.invalidateQueries({
        queryKey: menuItemKeys.all,
      }),
    );
  }

  if ((staffMenuQuery?.getObserversCount() ?? 0) > 0) {
    invalidations.push(
      queryClient.invalidateQueries({
        queryKey: menuItemKeys.staffAll,
      }),
    );
  }

  await Promise.all(invalidations);
}
